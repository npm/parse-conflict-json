const parseJSON = require('../')
const t = require('tap')
const {readFileSync} = require('fs')
const read = f => readFileSync(f, 'utf8')

t.matchSnapshot(parseJSON(JSON.stringify({a:'apple'})), 'parse unconflicted')
const conflicted = __dirname + '/fixtures/conflicted.json'
t.matchSnapshot(parseJSON(read(conflicted)), 'parse conflicted')
t.ok(parseJSON.isDiff(read(conflicted)), 'conflicted is a diff conflict')
t.notOk(parseJSON.isDiff(JSON.stringify({})), '{} is not a diff conflict')
t.notOk(parseJSON.isDiff(JSON.stringify({a: 1})), '{a:1} is not a diff conflict')
t.matchSnapshot(parseJSON(read(conflicted), null, 'theirs'), 'prefer theirs')
t.throws(() => parseJSON('', null, 'asdf'))
t.matchSnapshot(parseJSON('\uFEFF' + read(conflicted)), 'BOM is no problem')


const broken = __dirname + '/fixtures/broken.json'
t.throws(() => parseJSON(read(broken)), SyntaxError)
