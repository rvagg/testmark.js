# testmark (for JavaScript)

**Language-agnostic test fixtures in Markdown**

_Based on the Go [reference implementation](https://github.com/warpfork/go-testmark)_

> Wanna write test fixtures and example data in a language-agnostic way?
>
> Wanna be able to display those fixtures and examples in the middle of the docs you're already writing?
>
> Wanna be confident that your docs are also actually telling the truth, because your tests are executing directly on the example data in the docs?
>
> Are those docs already in markdown, and all you need is some glue code to read it (and maybe even patch it) programmatically?
>
> Welcome to `testmark`. You might like it.

See https://pkg.go.dev/github.com/warpfork/go-testmark for full documentation about how to write Markdown documents which embed testmark test fixture data.

See [example.md](./example.md) for a plain testmark example document, and [exampleWithDirs.md](./exampleWithDirs.md) for an example using paths as test names (for use with `index()`).

* [API](#api)
  * [`parse(md: string): Document`](#parsemd-string-document)
  * [`index(document: Document): DirEnt`](#indexdocument-document-dirent)
  * [`patch(document: Document, hunks: Hunk[]): Document`](#patchdocument-document-hunks-hunk-document)
  * [`toString(document: Document): string`](#tostringdocument-document-string)
* [Types](#types)
  * [`Document`](#document)
  * [`Hunk`](#hunk)
  * [`DocHunk`](#dochunk)
  * [`DirEnt`](#dirent)
* [License and Copyright](#license-and-copyright)

## API

The following functions are named exports of the package:

```js
import { parse, index, patch, toString } from 'testmark'
```

### `parse(md: string): Document`

Parse a Markdown document and return a testmark `Document` object containing the fixture data contained within.

See below for `Document` object specification.

### `index(document: Document): DirEnt`

Take a testmark `Document` (from a `parse()`) and return a `DirEnt` that represents the test fixture data as a directory and file structure. See [exampleWithDirs.md](./exampleWithDirs.md) for an example document. Test data can be navigated through the `DirEnt` structure as if it were a set of directories and files.

See below for `DirEnt` object specification.

### `patch(document: Document, hunks: Hunk[]): Document`

Take an existing testmark `Document` (from a `parse()`) and return a new `Document` that has been patched with new fixture data provided as an array of `Hunk` objects.

This operation is useful for filling in a Markdown document with output generated from programmatic fixture data generation. A skeleton Markdown document can be created and combined with data to form the output document. Hunks will be name matched with testmark fixture elements in the document, with the new data being inserted at that point. Hunks with names that don't appear in the existing document will be appended to the end.

The resulting `Document`'s `original` field will contain a stringified form of the document which can be written to file.

See below for `Hunk` object specification.

### `toString(document: Document): string`

A simple utility function that renders a testmark `Document` cleanly to a string for output. In most cases, the `original` property should be enough and this utility won't be needed.

## Types

### `Document`

```typescript
interface Document {
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
```

### `Hunk`

Provide objects of this form to `patch()`:

```typescript
interface Hunk {
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
```

### `DocHunk`

`DocHunk` extends `Hunk` and adds document-local information that are not expected for `patch()` operations:

```typescript
interface DocHunk extends Hunk {
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
```

### `DirEnt`

`DirEnt` objects can be navigated as directory & file structures by using the `children` map where `hunk` is `null` (a "directory"), and the `hunk` property where `children` is null (a "file").

```typescript
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
```

## License and Copyright

Copyright 2020 Rod Vagg

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.