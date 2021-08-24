/* eslint-env mocha */

import fs from 'fs'
import { parse, patch } from '../testmark.js'
import chai from 'chai'

const { assert } = chai

describe('Patch', () => {
  it('can patch example.md', async () => {
    const exampleMd = new URL('../example.md', import.meta.url)
    const exampleMdOriginal = await fs.promises.readFile(exampleMd, 'utf8')
    const patchedMd = new URL('./patch_expected.md', import.meta.url)
    // extracted from patch_test.go
    const patchedMdContents = await fs.promises.readFile(patchedMd, 'utf8')
    const doc = parse(exampleMdOriginal)
    const newDoc = patch(doc, [
      { name: 'more-data', blockTag: 'text', body: 'you have been...\nreplaced.\nand gotten\nrather longer.' },
      { name: 'this-is-the-data-name', blockTag: '', body: 'this one gets shorter.' },
      { name: 'this-one-is-new', blockTag: 'json', body: '{"hayo": "new data!"}' },
      { name: 'so-is-this', blockTag: 'json', body: '{"appending": "is fun"}' }
    ])
    assert.strictEqual(newDoc.original, patchedMdContents)
  })
})
