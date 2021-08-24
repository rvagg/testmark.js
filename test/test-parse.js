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
  it('can parse example.md', async () => {
    const exampleMd = new URL('../example.md', import.meta.url)
    const exampleMdOriginal = await fs.promises.readFile(exampleMd, 'utf8')
    const doc = parse(exampleMdOriginal)
    assert.deepStrictEqual(exampleMdExpectedHunks, doc.dataHunks)
    assert.deepStrictEqual(toString(doc), exampleMdOriginal.replace(/\r?\n/g, '\n'))
  })
})
