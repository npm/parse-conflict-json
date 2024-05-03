/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/basic.js > TAP > basic usage > parse unconflicted 1`] = `
Object {
  "a": "apple",
  [Symbol.for(indent)]: "",
  [Symbol.for(newline)]: "",
}
`

exports[`test/basic.js > TAP > conflicted > parse conflicted, preferring theirs 1`] = `
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
}
`

exports[`test/basic.js > TAP > conflicted > prefer theirs 1`] = `
Object {
  "a": Object {
    "b": Object {
      "c": "xxxx",
    },
  },
  "array": Array [
    111,
    Object {
      "foo": "baz",
    },
    2,
    3,
    Object {
      "foo": "bar",
    },
    1,
  ],
  [Symbol.for(indent)]: "",
  [Symbol.for(newline)]: "",
}
`

exports[`test/basic.js > TAP > error states > BOM is no problem 1`] = `
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
}
`

exports[`test/basic.js > TAP > global object attributes > filters out global object attributes 1`] = `
Object {
  "__proto__": "__proto__",
  "constructor": "constructor",
  [Symbol.for(indent)]: "",
  [Symbol.for(newline)]: "",
  "toString": "toString",
  "x": Object {},
}
`
