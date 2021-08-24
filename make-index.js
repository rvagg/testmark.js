/**
 * @typedef {import('./interface').DirEnt} DirEnt
 * @typedef {import('./interface').Document} Document
 * @typedef {import('./interface').Hunk} Hunk
 */

/**
 * Generate an index over the hunks, which treats their names as if they were
 * unix-style paths—meaning they're split by slashes, and each segment is
 * considered a directory. You must call the `BuildDirIndex()` function to
 * cause this to be populated.
 * @param {Document} document
 * @returns {DirEnt}
 */
export function index (document) {
  /**
   * @param {DirEntImpl} dir
   * @param {string[]} pathSegs
   * @param {Hunk} hunk
   */
  const fill = (dir, pathSegs, hunk) => {
    if (!pathSegs.length) {
      dir.hunk = hunk
    } else {
      const part = pathSegs[0]
      dir._makeChildren()
      const child = /** @type {DirEntImpl|void} */ (dir.children?.get(part))
      if (child) {
        fill(child, pathSegs.slice(1), hunk)
      } else {
        const newDir = new DirEntImpl(part)
        dir.children?.set(part, newDir)
        dir.childrenList?.push(newDir)
        fill(newDir, pathSegs.slice(1), hunk)
      }
    }
  }

  const dir = new DirEntImpl()
  for (const hunk of document.dataHunks) {
    fill(dir, hunk.name.split('/'), hunk)
  }
  return dir
}

/**
 * @implements {DirEnt}
 */
class DirEntImpl {
  /**
   * @param {string} [name]
   */
  constructor (name = '') {
    this.name = name
    /** @type {Hunk|null} */
    this.hunk = null
    /** @type {Map<string, DirEnt> | null} */
    this.children = null
    /** @type {DirEnt[] | null} */
    this.childrenList = null
  }

  _makeChildren () {
    if (!this.children) {
      this.children = new Map()
      this.childrenList = []
    }
  }
}
