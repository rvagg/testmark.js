export interface Document {
  /*
   * The original document, complete, but split into lines. We always save this,
   * because if we are going to write this document back out, it's going to be
   * by patching this.
   */
  original: string

  /*
   * The document, sliced into lines. Useful because we made it during parse
   * anyway, and it can save us a lot of work during edits.
   */
  lines: string[]

  /*
   * Each data hunk. Contains just offset information, and the parsed name
   * header. Is in order of hunk appearance.
   */
  dataHunks: DocHunk[]

  /*
   * Data hunks in Map form so we can easily reference them by name.
   */
  hunksByName: Map<string, DocHunk>
}

export interface Hunk {
  /*
   * The hunk name (e.g. whatever comes after `[testmark]:# ` and before any
   * more whitespace). Cannot be empty.
   */
  name: string

  /*
   * The code block syntax hint (or more literally: anything that comes after
   * the triple-tick that starts the code block). Usually we don't encourage use
   * of this much in testmark, but it's here.  Can be empty.
   */
  blockTag: string

  /*
   * The full body of the hunk, as bytes.
   */
  body: string
}


export interface DocHunk extends Hunk {
  /*
   * Index into Document.Original where the comment block is found. The code
   * block indicator is necessarily is the following line, and the code block
   * body one line after that.
   * Note that this is zero-indexed.  You probably want to +1 before printing to
   * a human.
   */
  lineStart: number

  /*
   * Index into Document.Original that contains the closing code block
   * indicator.
   */
  lineEnd: number
}

export interface DirEnt {
  /*
   * The name of just this path segment.
   * Note that if there's a Hunk in this DirEnt, its name may be different—it
   * still has the *full* path name.
   */
  name: string

  /*
   * A hunk, or null.
   */
  hunk: Hunk | null

  /*
   * Children, recursively as a named map, if any exist.
   */
  children: Map<string, DirEnt> | null

  /*
   * Children, recursively as an ordered list, if any exist.
   */
  childrenList: DirEnt[] | null
}
