/* eslint-env mocha */

import fs from 'fs'
import { parse, index } from '../testmark.js'
import * as chai from 'chai'

const { assert } = chai

describe('Index', () => {
  it('can parse and index exampleWithDirs.md', async () => {
    const exampleMd = new URL('../exampleWithDirs.md', import.meta.url)
    const exampleMdOriginal = await fs.promises.readFile(exampleMd, 'utf8')
    const doc = parse(exampleMdOriginal)
    const dirEnt = index(doc)
    // assertions matching index_test.go
    assert.equal(dirEnt.childrenList?.length, 2, 'root dirent list should be length 2')
    assert.equal(dirEnt.children?.size, 2, 'root dirent map should be length 2')
    assert.strictEqual(dirEnt.childrenList && dirEnt.childrenList[0]?.name, 'one', 'first child of root dirent should\'ve been \'one\'')
    assert.strictEqual(dirEnt.childrenList && dirEnt.childrenList[1]?.name, 'really', 'second child of root dirent should\'ve been \'really\'')
    assert.strictEqual(dirEnt.children?.get('one')?.hunk?.name, 'one', 'hunk \'one\' looked up through dir maps should still have the right name')
    assert.strictEqual(dirEnt.children?.get('one')?.hunk?.body, 'baz\n', 'hunk \'one\' looked up through dir maps should have the right content')
    assert.strictEqual(
      dirEnt.children?.get('really')?.children?.get('deep')?.children?.get('dirs')?.children?.get('wow')?.hunk?.name,
      'really/deep/dirs/wow',
      'hunk \'really/deep/dirs/wow\' looked up through dir maps should still have the right name'
    )
    assert.strictEqual(
      dirEnt.children?.get('really')?.children?.get('deep')?.children?.get('dirs')?.children?.get('wow')?.hunk?.body,
      'zot\n',
      'hunk \'really/deep/dirs/wow\' looked up through dir maps should have the right content'
    )
  })
})
