/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/cli.js > TAP > --help arg > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > --help arg > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > --help arg > stdout 1`] = `
Array [
  Array [
    String(
      usage: npx parse-conflict-json [OPTIONS...] [--] [FILE]...
      
      Parse JSON file(s) and resolve merge conflicts if possible.
      
      options:
       -h, --help       print this help and exit
       -v, --version    print version number and exit
       -i, --in-place   write resolved conflicts back to FILE (default to stdout)
       -p, --prefer {ours|theirs}
                        prefer *our* or *their* version of the file, respectively
                        (default: 'ours')
      
      Exits 0 on success, 1 on error.
    ),
  ],
]
`

exports[`test/cli.js > TAP > --help arg after other stuff > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > --help arg after other stuff > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > --help arg after other stuff > stdout 1`] = `
Array [
  Array [
    String(
      usage: npx parse-conflict-json [OPTIONS...] [--] [FILE]...
      
      Parse JSON file(s) and resolve merge conflicts if possible.
      
      options:
       -h, --help       print this help and exit
       -v, --version    print version number and exit
       -i, --in-place   write resolved conflicts back to FILE (default to stdout)
       -p, --prefer {ours|theirs}
                        prefer *our* or *their* version of the file, respectively
                        (default: 'ours')
      
      Exits 0 on success, 1 on error.
    ),
  ],
]
`

exports[`test/cli.js > TAP > --version arg > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > --version arg > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > --version arg > stdout 1`] = `
Array [
  Array [
    "{VERSION}",
  ],
]
`

exports[`test/cli.js > TAP > -h arg > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > -h arg > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > -h arg > stdout 1`] = `
Array [
  Array [
    String(
      usage: npx parse-conflict-json [OPTIONS...] [--] [FILE]...
      
      Parse JSON file(s) and resolve merge conflicts if possible.
      
      options:
       -h, --help       print this help and exit
       -v, --version    print version number and exit
       -i, --in-place   write resolved conflicts back to FILE (default to stdout)
       -p, --prefer {ours|theirs}
                        prefer *our* or *their* version of the file, respectively
                        (default: 'ours')
      
      Exits 0 on success, 1 on error.
    ),
  ],
]
`

exports[`test/cli.js > TAP > -v arg > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > -v arg > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > -v arg > stdout 1`] = `
Array [
  Array [
    "{VERSION}",
  ],
]
`

exports[`test/cli.js > TAP > conflicting file (ours) > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > conflicting file (ours) > stderr 1`] = `
Array [
  Array [
    "Error: unrecognized option --prefer",
  ],
]
`

exports[`test/cli.js > TAP > conflicting file (ours) > stdout 1`] = `
Array []
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg last) > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg last) > stderr 1`] = `
Array [
  Array [
    "Error: unrecognized option --prefer",
  ],
]
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg last) > stdout 1`] = `
Array []
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg separate) > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg separate) > stderr 1`] = `
Array [
  Array [
    "Error: unrecognized option --prefer",
  ],
]
`

exports[`test/cli.js > TAP > conflicting file (theirs, arg separate) > stdout 1`] = `
Array []
`

exports[`test/cli.js > TAP > conflicting file (theirs) > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > conflicting file (theirs) > stderr 1`] = `
Array [
  Array [
    "Error: unrecognized option --prefer",
  ],
]
`

exports[`test/cli.js > TAP > conflicting file (theirs) > stdout 1`] = `
Array []
`

exports[`test/cli.js > TAP > conflicting file > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > conflicting file > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > conflicting file > stdout 1`] = `
Array [
  Array [
    Object {
      "a": Object {
        "b": Object {
          "c": Object {
            "x": "bbbb",
          },
        },
      },
      "array": Array [
        100,
        Object {
          "foo": "baz",
        },
        1,
        3,
        Object {
          "foo": "bar",
        },
        1,
      ],
      [Symbol.for(indent)]: "",
      [Symbol.for(newline)]: "",
    },
  ],
]
`

exports[`test/cli.js > TAP > multiple files > exit code 1`] = `
0
`

exports[`test/cli.js > TAP > multiple files > stderr 1`] = `
Array []
`

exports[`test/cli.js > TAP > multiple files > stdout 1`] = `
Array [
  Array [
    Object {
      "a": Object {
        "b": Object {
          "c": Object {
            "x": "bbbb",
          },
        },
      },
      "array": Array [
        100,
        Object {
          "foo": "baz",
        },
        1,
        3,
        Object {
          "foo": "bar",
        },
        1,
      ],
      [Symbol.for(indent)]: "",
      [Symbol.for(newline)]: "",
    },
  ],
  Array [
    Object {
      "a": Object {
        "b": Object {
          "c": Object {
            "x": "bbbb",
          },
        },
      },
      "array": Array [
        100,
        Object {
          "foo": "baz",
        },
        1,
        3,
        Object {
          "foo": "bar",
        },
        1,
      ],
      [Symbol.for(indent)]: "",
      [Symbol.for(newline)]: "",
    },
  ],
]
`

exports[`test/cli.js > TAP > no args > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > no args > stderr 1`] = `
Array [
  Array [
    "Error: No files specified!",
  ],
]
`

exports[`test/cli.js > TAP > no args > stdout 1`] = `
Array []
`

exports[`test/cli.js > TAP > nonexistent file > exit code 1`] = `
1
`

exports[`test/cli.js > TAP > nonexistent file > stderr 1`] = `
Array [
  Array [
    "Error: ENOENT: no such file or directory, open 'nonexistent_file.json'",
  ],
]
`

exports[`test/cli.js > TAP > nonexistent file > stdout 1`] = `
Array []
`
