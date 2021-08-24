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
 * @typedef {import('./interface').DocHunk} DocHunk
 * @typedef {import('./interface').Document} Document
 * @typedef {import('./interface').Hunk} Hunk
 */
export const testmarkNamedRef: "[testmark]:#";
export const testmarkNamedRe: RegExp;
export type DocHunk = import('./interface').DocHunk;
export type Document = import('./interface').Document;
export type Hunk = import('./interface').Hunk;
//# sourceMappingURL=util.d.ts.map