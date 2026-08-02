/**
 * Eloquent JavaScript - Chapter 9: Regular Expressions
 * Offline Study Guide + Practice
 * Run with: node chapter9-regex-study.js
 */

console.log("=== Chapter 9: Regular Expressions ===\n")

// 1. Creating RegExps
const literal = /abc/
let re1 = new RegExp("abc")
const constructor = new RegExp(literal, "g")

console.log("Literal /abc/.test('abcde'):", literal.test("abcde")) // true
console.log("Constructor constructor.test('abcde'):", constructor.test("abcde")) // true

// 2. Sets & Character Classes
console.log("\n=== Character Sets ===")
console.log(/[0123456789]/.test("in 1992")) // true
console.log(/\d/.test("1992")) // true
console.log(/\w/.test("hello_world")) // true
console.log(/\s/.test("hello world")) // true
console.log(/[^01]/.test("1010")) // false (pure binary)

// 3. Repetition
console.log("\n=== Repetition ===")
console.log(/\d+/.test("'123'")) // true
console.log(/\d{1,2}-\d{1,2}-\d{4}/.test("1-30-2003")) // true

// 4. Grouping & Capturing
console.log("\n=== Grouping ===")
const dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/
console.log("DateTime match:", dateTime.test("1-30-2003 8:45"))

const match = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec("1-30-2003")
console.log("Captured groups:", match.slice(1)) // ["1", "30", "2003"]

// 5. Boundaries
console.log("\n=== Boundaries ===")
console.log(/\bcat\b/.test("concatenate")) // false
console.log(/\bcat\b/.test("cat food")) // true

// 6. Replace with function
console.log("\n=== Replace with function ===")
const stock = "1 lemon, 2 cabbages, and 100 eggs"
const result = stock.replace(/(\d+) (\w+)/g, (match, amount, unit) => {
  amount = Number(amount) - 1
  if (amount === 1) unit = unit.replace(/s$/, "") // singular
  if (amount === 0) return "no " + unit
  return amount + " " + unit
})
console.log(result) // "no lemon, 1 cabbage, and 99 eggs"

// 7. Practical Examples

// Email (simplified)
const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i
console.log("Valid email?", emailRegex.test("user@example.com"))

// URL slug
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
console.log("Valid slug?", slugRegex.test("my-awesome-post-123"))

// Extract numbers
const numbers = "Order 1234, Qty: 5, Price: $99.99".match(/\d+\.?\d*/g)
console.log("Extracted numbers:", numbers)

// === Exercises from the Book (Regexp Golf) ===
console.log("\n=== Regexp Golf Exercises ===")

function verify(regexp, yes, no) {
  for (let str of yes) {
    if (!regexp.test(str)) console.log(`Failure to match '${str}'`)
  }
  for (let str of no) {
    if (regexp.test(str)) console.log(`Unexpected match for '${str}'`)
  }
}

// 1. car and cat
verify(/ca(r|t)/, ["my car", "bad cats"], ["camper", "high art"])

// 2. pop and props
verify(/pr?op(s?)/, ["pop culture", "mad props"], ["pope", "proper"])

// Add more as you solve them...

console.log("\n=== Study Tips ===")
console.log("- Use https://regex101.com or https://regexper.com for visualization")
console.log("- Start simple, then add complexity")
console.log("- Prefer non-greedy when possible to avoid bugs")
console.log("- Test edge cases: empty string, special chars, unicode")
console.log("- Don't overuse regex when .includes() or manual parsing is clearer")
