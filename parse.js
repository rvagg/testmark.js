import { testmarkNamedRe, testmarkNamedRef } from './util.js'

/**
 * @typedef {import('./interface').DocHunk} DocHunk
 * @typedef {import('./interface').Document} Document
 */

/**
 * @param {string} original
 * @returns {Document}
 */
export function parse (original) {
  if (typeof original !== 'string') {
    throw new TypeError('Expected a Markdown document string')
  }

  /** @type {Document & {original:string}} */
  const doc = {
    original,
    lines: original.split('\n'), // can't split with \r? because we need offsets
    dataHunks: /** @type {DocHunk[]} */ ([]),
    hunksByName: new Map()
  }
  let inCodeBlock = false
  let expectCodeBlock = false
  /** @type {Partial<DocHunk> & {lineStart:number}} */
  let hunkInProgress = { lineStart: -1 }
  let offset = 0
  let codeBlockOffset = 0
  for (let i = 0; i < doc.lines.length; i++) {
    const line = doc.lines[i]
    if (line.startsWith('```')) {
      if (!inCodeBlock) { // starting a block
        if (expectCodeBlock) {
          hunkInProgress.blockTag = line.slice(3)
          codeBlockOffset = offset + line.length + 1
        }
        expectCodeBlock = false
      } else { // ending a block
        if (hunkInProgress.lineStart > -1) {
          const hunk = Object.assign(
            {
              // defaults
              blockTag: '',
              lineStart: -1,
              name: ''
            },
            hunkInProgress, // current state
            {
              // new state
              lineEnd: i,
              body: doc.original.substring(codeBlockOffset, offset)
            }
          )
          doc.dataHunks.push(hunk)
          doc.hunksByName.set(hunk.name, hunk)
          hunkInProgress = { lineStart: -1 }
        }
      }
      inCodeBlock = !inCodeBlock
    } else if (!inCodeBlock) {
      if (expectCodeBlock) {
        expectCodeBlock = false
      }

      if (line.startsWith(testmarkNamedRef)) {
        const match = line.match(testmarkNamedRe)
        if (!match) {
          throw new Error(`Invalid markdown comment on line ${i + 1} (should look like '[testmark]:# (data-name-here)', mind the parens)`)
        }
        const name = match[1]
        const already = doc.hunksByName.get(name)
        if (already) {
          throw new Error(`Repeated testmark hunk name ${name}, first seen on line ${already.lineStart + 1}, and again on line ${i + 1}`)
        }
        expectCodeBlock = true
        hunkInProgress.lineStart = i
        hunkInProgress.name = name
      }
    }
    offset += line.length + 1
  }

  return doc
}
