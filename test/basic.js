const parseJSON = require('../')
const t = require('tap')
const { readFileSync } = require('fs')
const path = require('path')
const conflicted = readFileSync((path.join(__dirname, '/fixtures/conflicted.json')), 'utf8')
const broken = readFileSync(path.join(__dirname, '/fixtures/broken.json'), 'utf8')
const proto = readFileSync(path.join(__dirname, '/fixtures/prototype.json'), 'utf8')

t.test('basic usage', async t => {
  t.matchSnapshot(parseJSON(JSON.stringify({ a: 'apple' })), 'parse unconflicted')
})

t.test('conflicted', async t => {
  t.matchSnapshot(parseJSON(conflicted), 'parse conflicted, preferring theirs')
  t.matchSnapshot(parseJSON(conflicted, null, 'theirs'), 'prefer theirs')
})

t.test('both sides remove the same entry', async t => {
  const cases = [
    {
      name: 'dependency',
      parent: { dependencies: { kept: '1', removed: '2' } },
      ours: { dependencies: { kept: '1' } },
      theirs: { dependencies: { kept: '1' } },
      expected: { dependencies: { kept: '1' } },
    },
    {
      name: 'package',
      parent: { packages: { '': {}, 'node_modules/removed': { version: '1' } } },
      ours: { packages: { '': {} } },
      theirs: { packages: { '': {} } },
      expected: { packages: { '': {} } },
    },
    {
      name: 'independent changes alongside the removal',
      parent: { dependencies: { removed: '1' } },
      ours: { dependencies: { ours: '2' } },
      theirs: { dependencies: { theirs: '3' } },
      expected: { dependencies: { ours: '2', theirs: '3' } },
    },
    {
      name: 'array entry',
      parent: { values: ['kept', 'removed'] },
      ours: { values: ['kept'] },
      theirs: { values: ['kept'] },
      expected: { values: ['kept'] },
    },
  ]

  for (const { name, parent, ours, theirs, expected } of cases) {
    const conflict = [
      '<<<<<<< ours',
      JSON.stringify(ours),
      '||||||| parent',
      JSON.stringify(parent),
      '=======',
      JSON.stringify(theirs),
      '>>>>>>> theirs',
    ].join('\n')

    for (const prefer of ['ours', 'theirs']) {
      t.same(parseJSON(conflict, null, prefer), expected, `${name}, prefer ${prefer}`)
    }
  }
})

t.test('isDiff', async t => {
  t.notOk(parseJSON.isDiff(JSON.stringify({})), '{} is not a diff conflict')
  t.notOk(parseJSON.isDiff(JSON.stringify({ a: 1 })), '{a:1} is not a diff conflict')
  t.ok(parseJSON.isDiff(conflicted), 'conflicted is a diff conflict')
})

t.test('error states', async t => {
  t.throws(() => parseJSON('', null, 'asdf'))
  t.matchSnapshot(parseJSON('\uFEFF' + conflicted), 'BOM is no problem')
  t.throws(() => parseJSON(broken), { name: 'JSONParseError' })
})

t.test('global object attributes', async t => {
  t.matchSnapshot(parseJSON(proto), 'filters out global object attributes')
})
