import { isDoc, isHunk, testmarkNamedRef, toString } from './util.js'

/**
 * @typedef {import('./interface').DocHunk} DocHunk
 * @typedef {import('./interface').Document} Document
 * @typedef {import('./interface').Hunk} Hunk
 */

/**
 * @param {Document} doc
 * @param {Hunk[]} hunks
 * @returns {Document}
 */
export function patch (doc, hunks) {
  if (!isDoc(doc)) {
    throw new TypeError('Expected a Testmark Document object')
  }
  if (!Array.isArray(hunks)) {
    throw new TypeError('Expected an array of Hunk objects')
  }
  /** @type {Map<string, Hunk>} */
  const newHunks = new Map()
  for (const hunk of hunks) {
    if (!isHunk(hunk)) {
      throw new TypeError('Expected an array of Hunk objects')
    }
    if (!hunk.name || /\s/.test(hunk.name)) {
      throw new Error('Hunk name must not be empty and cannot contain whitespace')
    }
    newHunks.set(hunk.name, hunk)
  }

  /** @type {Document} */
  const newDoc = {
    original: '',
    lines: /** @type {string[]} */ ([]),
    dataHunks: /** @type {DocHunk[]} */ ([]),
    hunksByName: /** @type {Map<string, DocHunk>} */ new Map()
  }

  let leftOff = 0

  for (const hunk of doc.dataHunks) {
    // Copy any prose lines from wherever we left off, up to the start of the new hunk.
    // And advance the marker for leftOff marker to past the end of the old hunk.
    newDoc.lines = newDoc.lines.concat(doc.lines.slice(leftOff, hunk.lineStart))
    leftOff = hunk.lineEnd + 1

    /** @type {string[]} */
    let newBodyLines = []
    const newHunk = newHunks.get(hunk.name)
    if (newHunk) {
      // Split our new hunk's body into lines, ready to append to the total content lines.
      // The rest... copy it into 'hunk', actually, it's a local variable and it makes the code slightly more DRY.
      newBodyLines = newHunk.body.split('\n')
      hunk.blockTag = newHunk.blockTag

      // Yeet from newHunks, as it's now handled
      newHunks.delete(hunk.name)
    } else {
      // Just... keep the old lines, which we can sub-slice back out of the old document.
      newBodyLines = doc.lines.slice(hunk.lineStart + 2, hunk.lineEnd)
    }

    // Append the hunk framing, and the body lines.
    // Watch how this changes the offsets, so we can build a new DocHunk with info that's correct.
    // (If you're just going to serialize this, it wouldn't matter, but if you want to patch multiple times, it matters.)
    const newLineStart = newDoc.lines.length
    newDoc.lines = appendHunkLines(newDoc.lines, hunk.name, hunk.blockTag, newBodyLines)
    const newLineEnd = newDoc.lines
    const docHunk = Object.assign({}, hunk, {
      lineStart: newLineStart,
      lineEnd: newLineEnd
    })
    // Append the updated hunk info to newDoc.
    newDoc.dataHunks.push(docHunk)
    newDoc.hunksByName.set(hunk.name, docHunk)
  }

  // Copy any remaining trailing prose lines.
  newDoc.lines = newDoc.lines.concat(doc.lines.slice(leftOff))

  // Now for any hunks we have left... We'll just stick them on the end, I guess.
  // And *now* the dang order of our original args matters.  We wouldn't want this to be randomized.
  for (const hunk of hunks) {
    // If it was already done, skip it.
    if (!newHunks.has(hunk.name)) {
      continue
    }
    // If we're about to need to append something, make sure there's at least one blank line first.
    if (newDoc.lines[newDoc.lines.length - 1].length) {
      newDoc.lines.push('')
    }
    // Append it.
    newDoc.lines = appendHunkLines(newDoc.lines, hunk.name, hunk.blockTag, hunk.body.split('\n'))
    // And one more trailing line, at the end.
    newDoc.lines.push('')
  }

  newDoc.original = toString(newDoc)
  return newDoc
}

/**
 * @param {string[]} lines
 * @param {string} hunkName
 * @param {string} hunkBlockTag
 * @param {string[]} hunkBodyLines
 * @returns {string[]}
 */
function appendHunkLines (lines, hunkName, hunkBlockTag, hunkBodyLines) {
  return lines.concat([
    `${testmarkNamedRef} (${hunkName})`,
    `\`\`\`${hunkBlockTag}`,
    ...hunkBodyLines,
    '```'
  ])
}
