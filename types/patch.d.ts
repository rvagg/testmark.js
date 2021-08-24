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
export function patch(doc: Document, hunks: Hunk[]): Document;
export type DocHunk = import('./interface').DocHunk;
export type Document = import('./interface').Document;
export type Hunk = import('./interface').Hunk;
//# sourceMappingURL=patch.d.ts.map