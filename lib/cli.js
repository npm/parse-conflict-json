const fs = require('fs');
const parseConflictJSON = require('.');
const { isDiff } = parseConflictJSON;
const { version, description } = require('../package.json');


const help = `\
usage: npx parse-conflict-json [OPTIONS...] [--] [FILE]...

Parse JSON file(s) and resolve merge conflicts if possible.

options:
 -h, --help       print this help and exit
 -v, --version    print version number and exit
 -i, --in-place   write resolved conflicts back to FILE (default to stdout)
 -p, --prefer {ours|theirs}
                  prefer *our* or *their* version of the file, respectively
                  (default: 'ours')

Exits 0 on success, 1 on error.\
`;


function parseArgs(argv = process.argv.slice(2)) {
  const argSepIdx = argv.findIndex(x => x == '--');
  const opts = argSepIdx >= 0 ? argv.slice(0, argSepIdx) : argv;
  const args = argSepIdx >= 0 ? argv.slice(argSepIdx + 1) : [];

  if (opts.find(arg => arg === "-h" || arg === "--help")) {
    console.log(help);
    return;
  }

  const options = {
    inPlace: false,
    prefer: '',
    files: (args.slice() || []),
  };

	for (let i = 0, len = opts.length; i < len; i++) {
    const [opt, ...maybeArg] = opts[i].split('=', 1);
    switch (opt) {
      case '-v':
      case '--version':
        console.log(version);
        return;
      case '-i':
      case '--in-place':
        if (maybeArg.length) {
          throw new Error(`option ${opt} does not take an argument`);
        }
        options.inPlace = true;
      case '-p':
      case '--prefer':
        const arg = maybeArg.length ? maybeArg[0] : opts[++i];
        options.prefer = arg; // error will be thrown by index.js
      default:
        if (args.length || opt.startsWith('-')) {
          throw new Error(`unrecognized option ${opt}`)
        } else {
          options.files.push(opt);
        }
    }
  }

  return options;
}

function main(argv = process.argv.slice(2)) {
  try {
    const options = parseArgs(argv);
    if (!options) { return 0; }

    if (!options.files.length) {
      throw Error("No files specified!");
    }

    for (const file of options.files) {
      const contents = fs.readFileSync(file).toString();

      if (!isDiff(contents)) {
        console.error(`warning: file {file} does not have conflict markers`);
      }

      const resolved = parseConflictJSON(contents, null, options.prefer);

      if (options.inPlace) {
        fs.writeFileSync(file, resolved);
        console.error(`${file}: wrote ${Buffer.byteLength(resolved, 'utf8')} bytes`)
      } else {
        console.log(resolved);
      }
    }
    return 0;

  } catch (err) {
    console.error(`${err}`);
    return 1;
  }
}

module.exports = { main, parseArgs };
