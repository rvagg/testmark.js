/* eslint-env mocha */

import fs from 'fs'
import { parse, toString } from '../testmark.js'
import chai from 'chai'

const { assert } = chai

// extracted from read_test.go
const exampleMdExpectedHunks = [
  {
    lineStart: 12,
    lineEnd: 16,
    name: 'this-is-the-data-name',
    blockTag: 'text',
    body: 'the content of this code block is data which can be read,\nand *replaced*, by testmark.\n'
  },
  {
    lineStart: 35,
    lineEnd: 40,
    name: 'more-data',
    blockTag: 'go',
    body: 'func OtherMarkdownParsers() (shouldHighlight bool) {\n\treturn true\n}\n'
  },
  {
    lineStart: 69,
    lineEnd: 72,
    name: 'cannot-describe-no-linebreak',
    blockTag: '',
    body: 'A markdown codeblock always has a trailing linebreak before its close indicator, you see.\n'
  }
]

describe('Read', () => {
  /** @type {string} */
  let exampleMdOriginal
  let isWindows = false

  before(async () => {
    const exampleMd = new URL('../example.md', import.meta.url)
    exampleMdOriginal = await fs.promises.readFile(exampleMd, 'utf8')
    isWindows = exampleMdOriginal.includes('\r\n')
  })

  it('can parse example.md', async () => {
    const doc = parse(exampleMdOriginal)
    assert.deepStrictEqual(exampleMdExpectedHunks, doc.dataHunks)
    if (isWindows) {
      assert.deepStrictEqual(toString(doc).replace(/\n/g, '\r\n'), exampleMdOriginal)
    } else {
      assert.deepStrictEqual(toString(doc), exampleMdOriginal)
    }
  })

  it('can parse example.md as windows', async function () {
    if (isWindows) { // skip test on windows
      return this.skip()
    }
    const exampleMdOriginalWindows = exampleMdOriginal.replace(/\r?\n/g, '\r\n')
    const doc = parse(exampleMdOriginalWindows)
    assert.deepStrictEqual(exampleMdExpectedHunks, doc.dataHunks)
    assert.deepStrictEqual(toString(doc), exampleMdOriginal)
  })
})
