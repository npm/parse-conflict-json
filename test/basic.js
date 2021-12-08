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
