const cli = require('../lib/cli')
const { version } = require('../package.json')
const t = require('tap')
const { readFileSync } = require('fs')

const path = require('path')
const conflictedPath = path.join(__dirname, '/fixtures/conflicted.json');
const brokenPath = path.join(__dirname, '/fixtures/broken.json');
const protoPath = path.join(__dirname, '/fixtures/prototype.json');

t.cleanSnapshot = s => s.replace(version, '{VERSION}');

t.beforeEach(t => {
  t.outs = t.capture(console, 'log');
  t.errs = t.capture(console, 'error');
});

for (const desc_arg of [
  ['no args', []],
  ['-h arg', ['-h']],
  ['--help arg', ['--help']],
  ['--help arg after other stuff', ['file1', 'file2', '--prefer', '--help']],
  ['-v arg', ['-v']],
  ['--version arg', ['--version']],
  ['nonexistent file', ['nonexistent_file.json']],
  ['conflicting file', [conflictedPath]],
  ['conflicting file (ours)', ['--prefer=ours', conflictedPath]],
  ['conflicting file (theirs)', ['--prefer=theirs', conflictedPath]],
  ['conflicting file (theirs, arg last)', [conflictedPath, '--prefer=theirs']],
  ['conflicting file (theirs, arg separate)', [conflictedPath, '--prefer', 'theirs']],
  ['multiple files', [conflictedPath, conflictedPath]],
]) {
  const [desc, argv] = desc_arg;
  t.test(desc, async t => {
    t.matchSnapshot(cli.main(argv), 'exit code');
    t.matchSnapshot(t.outs().map(({args}) => args), 'stdout');
    t.matchSnapshot(t.errs().map(({args}) => args), 'stderr');
  })
}

t.test('in-place updates', async t => {

  let files = {
    'broken.json': readFileSync(brokenPath),
    'conflicted.json': readFileSync(conflictedPath),
    'proto.json': readFileSync(protoPath),
  };
  let filePaths = Object.keys(files).map(f => path.join(t.testdirName, f));
  t.testdir(files);

  t.matchSnapshot(cli.main(['--in-place', ...filePaths]), 'exit code');
  t.matchSnapshot(t.outs().map(({args}) => args), 'stdout');
  t.matchSnapshot(t.errs().map(({args}) => args), 'stderr');

  for (let f of filePaths) {
    let newContent = readFileSync(f).toString()
    let oldContent = files[path.basename(f)];
    t.notSame(newContent, oldContent);
    t.matchSnapshot(newContent, `file ${path.basename(f)}`);
  }

});
