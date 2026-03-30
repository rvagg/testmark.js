/**
 * @typedef {import('./interface.js').DocHunk} DocHunk
 * @typedef {import('./interface.js').Document} Document
 * @typedef {import('./interface.js').Hunk} Hunk
 */
/**
 * @param {Document} doc
 * @param {Hunk[]} hunks
 * @returns {Document}
 */
export function patch(doc: Document, hunks: Hunk[]): Document;
export type DocHunk = import("./interface.js").DocHunk;
export type Document = import("./interface.js").Document;
export type Hunk = import("./interface.js").Hunk;
//# sourceMappingURL=patch.d.ts.map