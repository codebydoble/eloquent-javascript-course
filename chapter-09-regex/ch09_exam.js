/**
 * Eloquent JavaScript - Chapter 9: Regular Expressions Exam
 * Author: Yoandy Doble Herrera
 */

/* Exercise I: Regexp golf */

// 1. [] car and cat
const regExpE1 = new RegExp(/ca[rt]/, "g")

// 2. [] pop and prop
const regExpE2 = new RegExp(/pr?op/, "g")

// 3. [] ferret, ferry, and ferrari
const regExpE3 = new RegExp(/ferr(et|y|ari)/, "g")

// 4. [] Any word ending in ious
const regExpE4 = new RegExp(/\b[A-Za-z]+ious\b/, "g")

// 5. [] A whitespace character followed by a period, comma, colon, or semicolon
const regExpE5 = new RegExp(/\s[.,:;]/, "g")

// 6. [] A word longer than six letters
const regExpE6 = new RegExp(/\b[A-Za-z]{7,}\b/, "g")

// 7. [] A word without the letter e (or E)
const regExpE7 = new RegExp(/\b[^eE\W]+\b/, "g")

// E7 — word WITHOUT e or E
// YOUR REGEX: /[^eE][a-df-zA-DF-Z]+|[^eE]\b/
// PROBLEM: Matches characters inside words that contain e — not whole-word check.
// "earth" → student's regex matches "rth" (inside earth, no e) → UNEXPECTED MATCH
// "BEET" → matches "B" because B is [^eE] → UNEXPECTED MATCH
//
// FIX: \b[^eE\W]+\b
//   \b          word boundary
//   [^eE\W]+    one or more chars that are NOT e, NOT E, NOT non-word (\W)
//               [^eE\W] = word characters minus e and E = only letters/digits without e
//   \b          word boundary
//   This only matches COMPLETE words that contain zero e or E characters.

verify(/ca[rt]/, ["my car", "bad cats"], ["camper", "high art"])

verify(/pr?op/, ["pop culture", "mad props"], ["plop", "prrrop"])

verify(/ferr(et|y|ari)/, ["ferret", "ferry", "ferrari"], ["ferrum", "transfer A"])

verify(/\b[A-Za-z]+ious\b/, ["how delicious", "spacious room"], ["ruinous", "consciousness"])

verify(/\s[.,:;]/, ["bad punctuation ."], ["escape the period"])

verify(/\b[A-Za-z]{7,}\b/, ["Siebentausenddreihundertzweiundzwanzig"], ["no", "three small words"])

verify(/[^eE][a-df-zA-DF-Z]+|[^eE]\b/, ["red platypus", "wobbling nest"], ["earth bed", "bedrøvet abe", "BEET"])

function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return
  for (let str of yes)
    if (!regexp.test(str)) {
      console.log(`Failure to match '${str}'`)
    }
  for (let str of no)
    if (regexp.test(str)) {
      console.log(`Unexpected match for '${str}'`)
    }
}

/* Exercise II: Quoting style */
const text = "'I'm the cook,' he said, 'it's my job.'"
// Change this call.
const txtReplaced = text.replace(/^\'|\'\s|\s\'|\'$/g, (match, position, str) => {
  if (match.length === 1) return '"'
  return match.replace(/\'/g, '"')
})
console.log(txtReplaced)

/* Numbers again */

let number = /^[\+\-]?(\d+\.?\d*|\.\d+)([eE][\+\-]?\d+)?$/

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`)
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`)
  }
}
