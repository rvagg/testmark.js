/**
 * @typedef {import('./interface.js').DocHunk} DocHunk
 * @typedef {import('./interface.js').Document} Document
 * @typedef {import('./interface.js').Hunk} Hunk
 */
export type DocHunk = import('./interface.js').DocHunk;
export type Document = import('./interface.js').Document;
export type Hunk = import('./interface.js').Hunk;
export declare const testmarkNamedRef = "[testmark]:#";
export declare const testmarkNamedRe: RegExp;
/**
 * @param {Document} doc
 * @returns {string}
 */
export declare function toString(doc: Document): string;
/**
 * @param {Document} doc
 * @returns {boolean}
 */
export declare function isDoc(doc: Document): boolean;
/**
 * @param {DocHunk} hunk
 * @returns {boolean}
 */
export declare function isDocHunk(hunk: DocHunk): boolean;
/**
 * @param {Hunk} hunk
 * @returns {boolean}
 */
export declare function isHunk(hunk: Hunk): boolean;
//# sourceMappingURL=util.d.ts.map