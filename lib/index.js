const parseJSON = require('json-parse-even-better-errors')
const { diff } = require('just-diff')
const { diffApply } = require('just-diff-apply')

const globalObjectProperties = Object.getOwnPropertyNames(Object.prototype)

const stripBOM = content => {
  content = content.toString()
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1)
  }
  return content
}

const PARENT_RE = /\|{7,}/g
const OURS_RE = /<{7,}/g
const THEIRS_RE = /={7,}/g
const END_RE = />{7,}/g

const isDiff = str =>
  str.match(OURS_RE) && str.match(THEIRS_RE) && str.match(END_RE)

const stripOmittedHunkCommas = ({ parent, parentBoundaries, parentAncestors }) => {
  const containers = []
  let inString = false
  let escaped = false
  let previous = -1
  let blocked = false
  let pending = -1
  let start = 0
  let result = ''

  for (let i = 0; i < parent.length; i++) {
    const char = parent[i]
    if (parentAncestors.has(i)) {
      // An empty ancestor cannot lend its preceding comma to an adjacent omitted hunk.
      blocked = true
    }
    if (parentBoundaries.has(i)) {
      pending = parentBoundaries.get(i) && !blocked && !inString && parent[previous] === ',' &&
        containers[containers.length - 1] === '{' ? previous : -1
    }

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
    } else if (/\S/.test(char)) {
      // Only a closing object immediately after an omitted hunk can orphan a comma.
      if (pending !== -1 && char === '}') {
        result += parent.slice(start, pending)
        start = pending + 1
      }
      pending = -1
      blocked = false
      if (char === '"') {
        inString = true
      } else if (char === '{' || char === '[') {
        containers.push(char)
      } else if (char === '}' || char === ']') {
        containers.pop()
      }
      previous = i
    }
  }

  return result + parent.slice(start)
}

const parseConflictJSON = (str, reviver, prefer) => {
  prefer = prefer || 'ours'
  if (prefer !== 'theirs' && prefer !== 'ours') {
    throw new TypeError('prefer param must be "ours" or "theirs" if set')
  }

  str = stripBOM(str)

  if (!isDiff(str)) {
    return parseJSON(str)
  }

  const pieces = str.split(/[\n\r]+/g).reduce((acc, line) => {
    if (line.match(PARENT_RE)) {
      acc.state = 'parent'
      acc.hasParent = true
      acc.parentAncestors.add(acc.parent.length)
    } else if (line.match(OURS_RE)) {
      acc.state = 'ours'
      acc.hasParent = false
      acc.parentBoundaries.set(acc.parent.length, false)
    } else if (line.match(THEIRS_RE)) {
      acc.state = 'theirs'
    } else if (line.match(END_RE)) {
      acc.state = 'top'
      acc.parentBoundaries.set(acc.parent.length, !acc.hasParent)
    } else {
      if (acc.state === 'top' || acc.state === 'ours') {
        acc.ours += line
      }
      if (acc.state === 'top' || acc.state === 'theirs') {
        acc.theirs += line
      }
      if (acc.state === 'top' || acc.state === 'parent') {
        acc.parent += line
      }
    }
    return acc
  }, {
    state: 'top',
    ours: '',
    theirs: '',
    parent: '',
    hasParent: false,
    parentBoundaries: new Map(),
    parentAncestors: new Set(),
  })

  // this will throw if either piece is not valid JSON, that's intended
  const parent = parseJSON(stripOmittedHunkCommas(pieces), reviver)
  const ours = parseJSON(pieces.ours, reviver)
  const theirs = parseJSON(pieces.theirs, reviver)

  return prefer === 'ours'
    ? resolve(parent, ours, theirs)
    : resolve(parent, theirs, ours)
}

const isObj = obj => obj && typeof obj === 'object'

const copyPath = (to, from, path, i) => {
  const p = path[i]
  if (isObj(to[p]) && isObj(from[p]) &&
      Array.isArray(to[p]) === Array.isArray(from[p])) {
    return copyPath(to[p], from[p], path, i + 1)
  }
  to[p] = from[p]
}

// get the diff from parent->ours and applying our changes on top of theirs.
// If they turned an object into a non-object, then put it back.
const resolve = (parent, ours, theirs) => {
  const dours = diff(parent, ours)
  for (let i = 0; i < dours.length; i++) {
    if (globalObjectProperties.find(prop => dours[i].path.includes(prop))) {
      continue
    }
    try {
      diffApply(theirs, [dours[i]])
    } catch (e) {
      copyPath(theirs, ours, dours[i].path, 0)
    }
  }
  return theirs
}

module.exports = Object.assign(parseConflictJSON, { isDiff })
