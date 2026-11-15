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

t.test('reviver transforms unconflicted JSON', async t => {
  const keys = []
  const result = parseJSON('{"keep":1,"nested":{"value":2,"remove":3}}', (key, value) => {
    keys.push(key)
    return key === 'remove' ? undefined : typeof value === 'number' ? value * 2 : value
  })
  t.equal(result.keep, 2)
  t.same(result.nested, { value: 4 })
  t.same(keys, ['keep', 'value', 'remove', 'nested', ''])
})

t.test('reviver errors reject unconflicted JSON', async t => {
  const error = new Error('reviver error')
  t.throws(() => parseJSON('{"value":1}', () => {
    throw error
  }), { code: 'EJSONPARSE', systemError: error })
})

t.test('conflicted', async t => {
  t.matchSnapshot(parseJSON(conflicted), 'parse conflicted, preferring theirs')
  t.matchSnapshot(parseJSON(conflicted, null, 'theirs'), 'prefer theirs')
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
