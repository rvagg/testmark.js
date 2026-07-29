export type DocHunk = import('./interface.js').DocHunk;
export type Document = import('./interface.js').Document;
export type Hunk = import('./interface.js').Hunk;
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
export declare function patch(doc: Document, hunks: Hunk[]): Document;
//# sourceMappingURL=patch.d.ts.map