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
export function index(document: Document): DirEnt;
export type DirEnt = import('./interface').DirEnt;
export type Document = import('./interface').Document;
export type Hunk = import('./interface').Hunk;
//# sourceMappingURL=make-index.d.ts.map