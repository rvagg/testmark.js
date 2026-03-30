/**
 * @param {Document} doc
 * @returns {string}
 */
export function toString(doc: Document): string;
/**
 * @param {Document} doc
 * @returns {boolean}
 */
export function isDoc(doc: Document): boolean;
/**
 * @param {DocHunk} hunk
 * @returns {boolean}
 */
export function isDocHunk(hunk: DocHunk): boolean;
/**
 * @param {Hunk} hunk
 * @returns {boolean}
 */
export function isHunk(hunk: Hunk): boolean;
/**
 * @typedef {import('./interface.js').DocHunk} DocHunk
 * @typedef {import('./interface.js').Document} Document
 * @typedef {import('./interface.js').Hunk} Hunk
 */
export const testmarkNamedRef: "[testmark]:#";
export const testmarkNamedRe: RegExp;
export type DocHunk = import("./interface.js").DocHunk;
export type Document = import("./interface.js").Document;
export type Hunk = import("./interface.js").Hunk;
//# sourceMappingURL=util.d.ts.map