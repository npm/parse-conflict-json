const parseJSON = require('../')
const t = require('tap')

const hunk = (ours, theirs, parent) => [
  '<<<<<<< ours',
  ...ours,
  ...(parent === undefined ? [] : ['||||||| parent', ...parent]),
  '=======',
  ...theirs,
  '>>>>>>> theirs',
]

const jsonValue = value => JSON.parse(JSON.stringify(value))
const checkPreferences = (t, input, ours, theirs = ours) => {
  t.same(jsonValue(parseJSON(input)), ours, 'defaults to ours')
  t.same(jsonValue(parseJSON(input, null, 'ours')), ours, 'prefers ours')
  t.same(jsonValue(parseJSON(input, null, 'theirs')), theirs, 'prefers theirs')
}

t.test('infer the parent when the final member is conflicted', async t => {
  const lines = [
    '{',
    '"foo":"foo",',
    ...hunk(['"bar":"bar1"'], ['"bar":"bar2"']),
    '}',
  ]
  for (const newline of ['\n', '\r\n']) {
    checkPreferences(t, lines.join(newline),
      { foo: 'foo', bar: 'bar1' }, { foo: 'foo', bar: 'bar2' })
  }
})

t.test('identical sides still need a valid inferred parent', async t => {
  checkPreferences(t, [
    '{',
    '  "foo": "foo", \t',
    ...hunk(['"bar":"same"'], ['"bar":"same"']),
    ' \t}',
  ].join('\n'), { foo: 'foo', bar: 'same' })
})

t.test('merge independent additions using the inferred parent', async t => {
  checkPreferences(t, [
    '{"shared":true,',
    ...hunk(['"oursOnly":1'], ['"theirsOnly":2']),
    '}',
  ].join('\n'), { shared: true, oursOnly: 1, theirsOnly: 2 })
})

t.test('match the closing nested object after an array value', async t => {
  checkPreferences(t, [
    '{"nested":{"shared":[1,{"s":"[}]"}],',
    ...hunk(['"bar":1'], ['"bar":2']),
    '},"tail":true}',
  ].join('\n'),
  { nested: { shared: [1, { s: '[}]' }], bar: 1 }, tail: true },
  { nested: { shared: [1, { s: '[}]' }], bar: 2 }, tail: true })
})

t.test('repair separate omitted hunks in separate objects', async t => {
  checkPreferences(t, [
    '{"first":{"shared":1,',
    ...hunk(['"bar":1'], ['"bar":2']),
    '},"second":{"shared":2,',
    ...hunk(['"bar":3'], ['"bar":4']),
    '}}',
  ].join('\n'),
  { first: { shared: 1, bar: 1 }, second: { shared: 2, bar: 3 } },
  { first: { shared: 1, bar: 2 }, second: { shared: 2, bar: 4 } })
})

t.test('adjacent omitted hunks share a deletion boundary', async t => {
  checkPreferences(t, [
    '{"shared":true,',
    ...hunk(['"first":1,'], ['"first":2,']),
    ...hunk(['"last":3'], ['"last":4']),
    '}',
  ].join('\n'),
  { shared: true, first: 1, last: 3 }, { shared: true, first: 2, last: 4 })
})

t.test('a common member consumes an omitted boundary', async t => {
  checkPreferences(t, [
    '{"first":1,',
    ...hunk(['"bar":1,'], ['"bar":2,']),
    '"tail":true}',
  ].join('\n'), { first: 1, bar: 1, tail: true }, { first: 1, bar: 2, tail: true })
  checkPreferences(t, [
    '{',
    ...hunk(['"bar":1,'], ['"bar":2,']),
    '"tail":true}',
  ].join('\n'), { bar: 1, tail: true }, { bar: 2, tail: true })
  checkPreferences(t, [
    '{',
    ...hunk(['"bar":1'], ['"bar":2']),
    '}',
  ].join('\n'), { bar: 1 }, { bar: 2 })
})

t.test('commas and delimiters inside strings are not structural', async t => {
  for (const prefix of ['a,', 'a",', 'a\\,', 'a\\",', 'a\\\\,']) {
    checkPreferences(t, [
      '{"s":' + JSON.stringify(prefix).slice(0, -1),
      ...hunk([], ['y']),
      '}b"}',
    ].join('\n'), { s: prefix + 'y}b' })
  }
  checkPreferences(t, [
    '{"s":"a\\',
    ...hunk([], ['t']),
    'n"}',
  ].join('\n'), { s: 'a\tn' })
})

t.test('escaped quotes before a structural comma do not hide it', async t => {
  const text = 'a",\\}[\\'
  checkPreferences(t, [
    '{"s":' + JSON.stringify(text) + ',',
    ...hunk(['"bar":1'], ['"bar":2']),
    '}',
  ].join('\n'), { s: text, bar: 1 }, { s: text, bar: 2 })
})

t.test('an explicit ancestor stays strict even when empty', async t => {
  for (const parent of [[], [' \t'], ['"bad":']]) {
    const input = [
      '{"shared":true,',
      ...hunk(['"bar":1'], ['"bar":2'], parent),
      '}',
    ].join('\n')
    for (const prefer of ['ours', 'theirs']) {
      t.throws(() => parseJSON(input, null, prefer), { name: 'JSONParseError' })
    }
  }
})

t.test('an explicit ancestor invalidates an adjacent omitted boundary', async t => {
  for (const parents of [
    [undefined, []],
    [[], undefined],
    [undefined, [' \t']],
    [[' \t'], undefined],
  ]) {
    t.throws(() => parseJSON([
      '{"shared":true,',
      ...hunk(['"first":1,'], ['"first":2,'], parents[0]),
      ...hunk(['"last":3'], ['"last":4'], parents[1]),
      '}',
    ].join('\n')), { name: 'JSONParseError' })
  }
})

t.test('a common token after an explicit ancestor allows a new boundary', async t => {
  checkPreferences(t, [
    '{"first":',
    ...hunk(['1,'], ['2,'], ['0,']),
    '"nested":{"shared":true,',
    ...hunk(['"last":3'], ['"last":4']),
    '}}',
  ].join('\n'),
  { first: 1, nested: { shared: true, last: 3 } },
  { first: 2, nested: { shared: true, last: 4 } })
  checkPreferences(t, [
    '{"shared":true,',
    ...hunk(['"first":1,'], ['"first":2,'], ['"first":0,']),
    ...hunk(['"last":3'], ['"last":4']),
    '}',
  ].join('\n'),
  { shared: true, first: 1, last: 3 }, { shared: true, first: 2, last: 4 })
})

t.test('do not repair array commas, unrelated commas, or wrong delimiters', async t => {
  for (const input of [
    '{"foo":"foo",}',
    ['[1,', ...hunk(['2'], ['3']), ']'].join('\n'),
    ['{"foo":1,', ...hunk(['"bar":1'], ['"bar":2']), ']'].join('\n'),
    ['{"foo":1,', ...hunk(['"bar":1'], ['"bar":2'])].join('\n'),
    [
      '{"bad":{"x":1,},"good":{"foo":1,',
      ...hunk(['"bar":1'], ['"bar":2']),
      '}}',
    ].join('\n'),
    [
      '{"foo":1,',
      ...hunk(['"bar":1,'], ['"bar":2,']),
      '"tail":0,}',
    ].join('\n'),
  ]) {
    t.throws(() => parseJSON(input), { name: 'JSONParseError' })
  }
})

t.test('both sides remain strict regardless of preference', async t => {
  for (const sides of [[['"bar":'], ['"bar":2']], [['"bar":1'], ['"bar":']]]) {
    const input = ['{"foo":1,', ...hunk(...sides), '}'].join('\n')
    for (const prefer of ['ours', 'theirs']) {
      t.throws(() => parseJSON(input, null, prefer), { name: 'JSONParseError' })
    }
  }
})

t.test('reviver visits parent, ours, and theirs exactly once in order', async t => {
  const keys = []
  const roots = []
  const result = parseJSON([
    '{"foo":1,',
    ...hunk(['"bar":2'], ['"bar":3']),
    '}',
  ].join('\n'), (key, value) => {
    keys.push(key)
    if (key === '') {
      roots.push(jsonValue(value))
    }
    return value
  })
  t.same(jsonValue(result), { foo: 1, bar: 2 })
  t.same(keys, ['foo', '', 'foo', 'bar', '', 'foo', 'bar', ''])
  t.same(roots, [{ foo: 1 }, { foo: 1, bar: 2 }, { foo: 1, bar: 3 }])
})

t.test('reviver SyntaxErrors are wrapped without retrying any piece', async t => {
  for (const parent of [undefined, ['"bar":0']]) {
    const input = ['{"foo":1,', ...hunk(['"bar":2'], ['"bar":3'], parent), '}'].join('\n')
    for (const stopAt of [1, 2, 3]) {
      const sentinel = new SyntaxError('reviver error')
      let roots = 0
      let caught
      try {
        parseJSON(input, (key, value) => {
          if (key === '' && ++roots === stopAt) {
            throw sentinel
          }
          return value
        })
      } catch (error) {
        caught = error
      }
      t.match(caught, { name: 'JSONParseError', code: 'EJSONPARSE' })
      t.equal(caught && caught.systemError, sentinel)
      t.equal(roots, stopAt)
    }
  }
})
