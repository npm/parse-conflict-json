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

t.test('marker text in valid JSON is not a conflict', async t => {
  const values = [
    { text: '<<<<<<< ======= >>>>>>> |||||||' },
    { ours: '<<<<<<< HEAD', theirs: '=======', end: '>>>>>>> branch' },
    ['<<<<<<<', '=======', '>>>>>>>'],
    { text: 'before\u2028<<<<<<<\u2029=======\u2028>>>>>>>\u2029|||||||' },
  ]
  for (const value of values) {
    const input = JSON.stringify(value, null, 2)
    t.notOk(parseJSON.isDiff(input), 'quoted markers are not control lines')
    t.same(parseJSON(input), value, 'valid JSON is preserved')
  }
})

t.test('quoted marker text is preserved in each conflict piece', async t => {
  const input = [
    '{',
    '  "unchanged": "<<<<<<< ======= >>>>>>> |||||||",',
    '<<<<<<< ours',
    '  "choice": "ours <<<<<<< ======= >>>>>>> |||||||"',
    '||||||| base',
    '  "choice": "base <<<<<<< ======= >>>>>>> |||||||"',
    '=======',
    '  "choice": "theirs <<<<<<< ======= >>>>>>> |||||||"',
    '>>>>>>> theirs',
    '}',
  ].join('\n')
  for (const prefer of ['ours', 'theirs']) {
    const expected = {
      unchanged: '<<<<<<< ======= >>>>>>> |||||||',
      choice: `${prefer} <<<<<<< ======= >>>>>>> |||||||`,
    }
    t.ok(parseJSON.isDiff(input), 'physical conflict markers are detected')
    t.same(parseJSON(input, null, prefer), expected, `prefer ${prefer}`)
  }
})

t.test('physical marker boundaries and widths', async t => {
  for (const newline of ['\n', '\r\n', '\r']) {
    for (const indent of ['', ' \t']) {
      const input = [
        `${indent}<<<<<<<<< ours`,
        '["ours", "||||||| ======= >>>>>>> <<<<<<<"]',
        `${indent}||||||||| base`,
        '["base", "||||||| ======= >>>>>>> <<<<<<<"]',
        `${indent}=========`,
        '["theirs", "||||||| ======= >>>>>>> <<<<<<<"]',
        `${indent}>>>>>>>>> theirs`,
      ].join(newline)
      t.ok(parseJSON.isDiff(input), 'wide markers at physical line starts are detected')
      t.ok(parseJSON.isDiff('\uFEFF' + input), 'a BOM at the file start is supported')
      for (const prefer of ['ours', 'theirs']) {
        const expected = [prefer, '||||||| ======= >>>>>>> <<<<<<<']
        t.same(parseJSON(input, null, prefer), expected, `root array, prefer ${prefer}`)
      }
      t.same(parseJSON(Buffer.from('\uFEFF' + input)),
        ['ours', '||||||| ======= >>>>>>> <<<<<<<'], 'BOM and Buffer input')
    }
  }
  t.notOk(parseJSON.isDiff('<<<<<< ours\n======\n>>>>>> theirs'),
    'six-character sequences are not conflict markers')
})

t.test('error states', async t => {
  t.throws(() => parseJSON('', null, 'asdf'))
  t.matchSnapshot(parseJSON('\uFEFF' + conflicted), 'BOM is no problem')
  t.throws(() => parseJSON(broken), { name: 'JSONParseError' })
})

t.test('global object attributes', async t => {
  t.matchSnapshot(parseJSON(proto), 'filters out global object attributes')
})
