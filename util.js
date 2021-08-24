/**
 * @typedef {import('./interface').DocHunk} DocHunk
 * @typedef {import('./interface').Document} Document
 * @typedef {import('./interface').Hunk} Hunk
 */

export const testmarkNamedRef = '[testmark]:#'
export const testmarkNamedRe = /^\[testmark\]:# \(\s*([^\s]+)\s*\)$/

/**
 * @param {Document} doc
 * @returns {string}
 */
export function toString (doc) {
  return doc.lines.join('\n')
}

/**
 * @param {Document} doc
 * @returns {boolean}
 */
export function isDoc (doc) {
  /*
  original: string | null
  lines: string[]
  dataHunks: DocHunk[]
  hunksByName: Map<string, DocHunk>
  */
  if (typeof doc !== 'object') {
    return false
  }
  if (doc.original !== null && typeof doc.original !== 'string') {
    return false
  }
  if (!Array.isArray(doc.lines) || !Array.isArray(doc.dataHunks)) {
    return false
  }
  for (const line of doc.lines) {
    if (typeof line !== 'string') {
      return false
    }
  }
  for (const hunk of doc.dataHunks) {
    if (!isDocHunk(hunk)) {
      return false
    }
  }
  if (!(doc.hunksByName instanceof Map)) {
    return false
  }
  return true
}

/**
 * @param {DocHunk} hunk
 * @returns {boolean}
 */
export function isDocHunk (hunk) {
  /*
  lineStart: number
  lineEnd: number
  */
  if (typeof hunk !== 'object') {
    return false
  }
  if (typeof hunk.lineStart !== 'number' || typeof hunk.lineEnd !== 'number') {
    return false
  }
  return isHunk(hunk)
}

/**
 * @param {Hunk} hunk
 * @returns {boolean}
 */
export function isHunk (hunk) {
  /*
  name: string
  blockTag: string
  body: string
  */
  if (typeof hunk !== 'object') {
    return false
  }
  if (typeof hunk.name !== 'string' || typeof hunk.blockTag !== 'string' || typeof hunk.body !== 'string') {
    return false
  }
  return true
}
