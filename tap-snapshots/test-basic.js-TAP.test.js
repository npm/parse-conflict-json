/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/basic.js TAP > BOM is no problem 1`] = `
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
}
`

exports[`test/basic.js TAP > parse both.json both 1`] = `
Object {
  "a": "a",
  "b": "b",
  "c": "c",
  "d": "d",
  "foo": "bar",
}
`

exports[`test/basic.js TAP > parse conflicted 1`] = `
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
}
`

exports[`test/basic.js TAP > parse unconflicted 1`] = `
Object {
  "a": "apple",
}
`

exports[`test/basic.js TAP > prefer theirs 1`] = `
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
}
`
