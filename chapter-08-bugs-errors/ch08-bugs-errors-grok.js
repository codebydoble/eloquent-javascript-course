/*
========================================
ELOQUENT JAVASCRIPT - CHAPTER 8
BUGS AND ERRORS
========================================

CONCEPTS COVERED:
1.  Strict Mode ("use strict")
2.  Types and type coercion bugs
3.  Linting (static analysis)
4.  Testing basics
5.  Debugging techniques
6.  Exceptions (throw / try / catch / finally)
7.  Custom Error classes
8.  Error propagation
9.  Selective catching
10. Assertions

STUDY ORDER:
Read each section top to bottom.
Run this file with: node chapter8.js
All output labeled so you know what each section prints.

OFFLINE STUDY TIPS:
- Read comments carefully (they ARE the explanation)
- Modify test values and re-run to experiment
- Use console.log() to inspect anything confusing

========================================
*/

"use strict"

// ========================================
// SECTION 1: WHAT ARE BUGS?
// ========================================

/*
A BUG is unintended behavior in a program.
Three categories:

1. SYNTAX ERRORS
   - Code violates JavaScript grammar rules
   - Caught BEFORE the program runs
   - Example: missing bracket, wrong keyword

2. RUNTIME ERRORS
   - Code is syntactically valid BUT fails during execution
   - Example: calling undefined as function, null reference

3. LOGIC ERRORS
   - Code runs without crashing BUT produces wrong result
   - Hardest to find because JavaScript won't complain
   - Example: wrong formula, off-by-one error

CHAPTER 8 TEACHES:
How to PREVENT, FIND, and HANDLE all three types.
*/

console.log("========================================")
console.log("CHAPTER 8: BUGS AND ERRORS")
console.log("========================================\n")

// ========================================
// SECTION 2: STRICT MODE
// ========================================

/*
CONCEPT: "use strict"

JavaScript has TWO modes:
1. SLOPPY mode (default, legacy, forgiving)
2. STRICT mode ("use strict" directive)

STRICT MODE:
- Prevents common silent mistakes from becoming bugs
- Throws errors where sloppy mode silently ignores problems
- Required for modern JavaScript development
- ALWAYS use it in your code

HOW TO ENABLE:
- Add "use strict" at top of file (affects whole file)
- Add "use strict" at top of function (affects only that function)
- ES6 modules and classes are ALWAYS strict by default

NOTE: This entire file has "use strict" at the top (line 1).
*/

console.log("=== SECTION 2: STRICT MODE ===\n")

// EXAMPLE 1: Undeclared variables
// In sloppy mode: creates global variable silently (BUG!)
// In strict mode: throws ReferenceError immediately (GOOD!)

function strictModeDemo() {
  "use strict" // This function is strict even without file-level strict

  try {
    // This would create a global variable in sloppy mode
    // In strict mode: ReferenceError
    undeclaredVariable = "I'm a bug!"
  } catch (error) {
    console.log("Strict mode caught undeclared variable:")
    console.log(" Error:", error.message)
    console.log(" WHY THIS IS GOOD: Bug is caught immediately,")
    console.log(" not silently ignored as a global variable\n")
  }
}

strictModeDemo()

// EXAMPLE 2: Duplicate parameters
// In sloppy mode: silently uses last value
// In strict mode: SyntaxError (caught at parse time)

/*
This would be a SyntaxError in strict mode:

function duplicateParams(a, a) {  // SyntaxError!
  return a
}

In sloppy mode, the second 'a' silently overwrites the first.
This is almost always a bug.
*/

console.log("Strict mode prevents:")
console.log("  ✓ Undeclared variables (typos in variable names)")
console.log("  ✓ Duplicate parameter names")
console.log("  ✓ Writing to read-only properties")
console.log("  ✓ Using reserved words as identifiers")
console.log("  ✓ Deleting undeletable properties\n")

// EXAMPLE 3: 'this' keyword behavior
// In strict mode, 'this' inside a regular function is undefined
// In sloppy mode, 'this' defaults to global object (window/global)

function showThisStrict() {
  "use strict"
  console.log("'this' in strict function:", this)
  // undefined - correct! Not bound to anything
}

function showThisSloppy() {
  // No strict mode
  // 'this' would be global object in browser (window)
  // In Node.js: global object
  console.log("'this' in sloppy function:", typeof this)
}

console.log("'this' behavior in strict mode:")
showThisStrict() // undefined
showThisSloppy() // object (global)
console.log()

// ========================================
// SECTION 3: TYPE COERCION BUGS
// ========================================

/*
CONCEPT: Type Coercion

JavaScript AUTOMATICALLY converts types in many situations.
This is called TYPE COERCION and is a major source of bugs.

JavaScript has TWO equality operators:
== (loose equality, allows coercion)
=== (strict equality, no coercion)

RULE: ALWAYS use === and !==
       NEVER use == and != (unless you have a very specific reason)
*/

console.log("=== SECTION 3: TYPE COERCION BUGS ===\n")

// Classic JavaScript type coercion surprises
console.log("TYPE COERCION SURPRISES (why == is dangerous):\n")

console.log("'' == false:        ", "" == false) // true  (SURPRISE!)
console.log("0 == false:         ", 0 == false) // true  (SURPRISE!)
console.log("'' == 0:            ", "" == 0) // true  (SURPRISE!)
console.log("null == undefined:  ", null == undefined) // true  (SURPRISE!)
console.log("null == false:      ", null == false) // false (SURPRISE!)
console.log("[] == false:        ", [] == false) // true  (SURPRISE!)
console.log('"1" == 1:          ', "1" == 1) // true  (SURPRISE!)
console.log('"01" == 1:         ', "01" == 1) // true  (SURPRISE!)

console.log("\nSTRICT EQUALITY (safe, no surprises):\n")

console.log("'' === false:       ", "" === false) // false (CORRECT)
console.log("0 === false:        ", 0 === false) // false (CORRECT)
console.log("'' === 0:           ", "" === 0) // false (CORRECT)
console.log("null === undefined: ", null === undefined) // false (CORRECT)
console.log('"1" === 1:         ', "1" === 1) // false (CORRECT)

console.log("\n--- ARITHMETIC COERCION BUGS ---\n")

// String + Number: concatenation, not addition!
console.log('"5" + 3:        ', "5" + 3) // "53" not 8!
console.log('"5" - 3:        ', "5" - 3) // 2 (subtraction coerces to number)
console.log('"5" * "3":      ', "5" * "3") // 15 (multiplication coerces)
console.log('"5" + +"3":     ', "5" + +"3") // "53" (unary + first, then concat)

// How bugs happen in real code:
function addValues(a, b) {
  return a + b // BUG: if a or b is a string, this concatenates!
}

console.log("\nDangerous function addValues(a, b) { return a + b }")
console.log("addValues(5, 3):      ", addValues(5, 3)) // 8 (works)
console.log('addValues("5", 3):    ', addValues("5", 3)) // "53" (BUG!)
console.log('addValues(5, "3"):    ', addValues(5, "3")) // "53" (BUG!)

// Safe version with type checking
function addValuesSafe(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError(`Expected numbers, got ${typeof a} and ${typeof b}`)
  }
  return a + b
}

console.log("\nSafe version addValuesSafe(a, b):")
console.log("addValuesSafe(5, 3):    ", addValuesSafe(5, 3)) // 8

try {
  addValuesSafe("5", 3)
} catch (error) {
  console.log('addValuesSafe("5", 3):', error.message) // TypeError caught
}

console.log("\n--- NaN (Not a Number) BUGS ---\n")

/*
NaN is a special number value meaning "invalid number".
It's the result of bad arithmetic operations.

THE MOST CONFUSING THING ABOUT NaN:
NaN !== NaN  (NaN is not equal to itself!)
This is intentional (IEEE 754 floating point standard)
Use Number.isNaN() to check for NaN
*/

const badMath = "hello" * 5
console.log('"hello" * 5:           ', badMath) // NaN
console.log("typeof NaN:            ", typeof NaN) // "number" (!)
console.log("NaN === NaN:           ", NaN === NaN) // false (!)
console.log("NaN == NaN:            ", NaN == NaN) // false (!)
console.log("isNaN('hello'):        ", isNaN("hello")) // true (but unreliable)
console.log("Number.isNaN(NaN):     ", Number.isNaN(NaN)) // true (reliable!)
console.log("Number.isNaN('hello'): ", Number.isNaN("hello")) // false (!)

// Why Number.isNaN() is better than isNaN():
console.log("\nWhy Number.isNaN() is better:")
console.log("isNaN('hello'):        ", isNaN("hello")) // true  (coerces first)
console.log("Number.isNaN('hello'): ", Number.isNaN("hello")) // false (no coercion)
console.log("isNaN(undefined):      ", isNaN(undefined)) // true  (coerces first)
console.log("Number.isNaN(undefined):", Number.isNaN(undefined)) // false (no coercion)

console.log("\n")

// ========================================
// SECTION 4: DEBUGGING TECHNIQUES
// ========================================

/*
CONCEPT: Debugging

When your program has a bug, how do you find it?

TECHNIQUES:
1. console.log() - print intermediate values
2. console.error() - print errors prominently
3. console.table() - print arrays/objects as table
4. console.group() - group related logs
5. console.time() - measure performance
6. Debugger statement - pause execution
7. Process of elimination
8. Rubber duck debugging (explain code out loud)
*/

console.log("=== SECTION 4: DEBUGGING TECHNIQUES ===\n")

// TECHNIQUE 1: console methods
console.log("--- Console Methods ---\n")

const villageData = [
  { name: "Alice's House", roads: 3 },
  { name: "Post Office", roads: 2 },
  { name: "Town Hall", roads: 4 },
]

// console.log() - basic
console.log("console.log():")
console.log(villageData[0])

// console.table() - great for arrays/objects
console.log("\nconsole.table():")
console.table(villageData)

// console.error() - shows in red in terminal/browser
console.log("\nconsole.error():")
console.error("This is an error message (shows in red)")

// console.warn() - shows in yellow
console.warn("This is a warning message (shows in yellow)")

// console.group() - organize related output
console.log("\nconsole.group():")
console.group("Robot Simulation")
console.log("Starting position: Post Office")
console.log("Parcels: 5")
console.group("Step 1")
console.log("Moving to: Alice's House")
console.log("Parcels remaining: 4")
console.groupEnd()
console.groupEnd()

// console.time() - measure execution time
console.log("\nconsole.time() - measuring performance:")
console.time("loop-test")
let sum = 0
for (let i = 0; i < 1000000; i++) sum += i
console.timeEnd("loop-test")
console.log("Sum:", sum)

// TECHNIQUE 2: Systematic debugging approach
console.log("\n--- Systematic Debugging ---\n")

/*
BUGGY FUNCTION: Find the bug!
This function should calculate average but has a bug.
*/

function calculateAverage(numbers) {
  // Add debug logging to find the bug
  console.log("Input:", numbers)
  console.log("Input type:", typeof numbers)
  console.log("Is array:", Array.isArray(numbers))

  if (!Array.isArray(numbers) || numbers.length === 0) {
    console.log("Edge case: empty or non-array")
    return 0
  }

  let total = 0
  for (const num of numbers) {
    console.log(`  Adding ${num} (type: ${typeof num}) to total ${total}`)
    total += num // BUG HERE if num is a string!
  }

  console.log("Total:", total)
  console.log("Count:", numbers.length)

  return total / numbers.length
}

console.log("Debugging calculateAverage with mixed types:")
console.log("Result:", calculateAverage([1, 2, "3", 4])) // Bug: "3" causes string concat
console.log()

// Fixed version with defensive programming
function calculateAverageFixed(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0

  // Convert all to numbers first, filter out NaN
  const validNumbers = numbers
    .map(Number) // Convert to number
    .filter((n) => !Number.isNaN(n)) // Remove invalid

  if (validNumbers.length === 0) return 0

  const total = validNumbers.reduce((sum, n) => sum + n, 0)
  return total / validNumbers.length
}

console.log("Fixed calculateAverageFixed:")
console.log(calculateAverageFixed([1, 2, "3", 4])) // 2.5 (correct!)
console.log(calculateAverageFixed([1, "hello", 3])) // 2 (skips invalid)
console.log(calculateAverageFixed([])) // 0
console.log()

// ========================================
// SECTION 5: EXCEPTIONS - BASIC
// ========================================

/*
CONCEPT: Exceptions

When something goes wrong, JavaScript can THROW an exception.
An exception is an object that contains error information.
Exceptions UNWIND the call stack until caught or crash the program.

KEYWORDS:
throw  - Creates and throws an exception
try    - Block of code that might throw
catch  - Handles thrown exception
finally- Always runs (with or without error)

CALL STACK UNWINDING:
function a() { b() }
function b() { c() }
function c() { throw new Error("boom") }

a() → b() → c() → throws Error
Error unwinds: c → b → a → uncaught (crash)

If a() had try/catch, it would be caught there.
*/

console.log("=== SECTION 5: EXCEPTIONS - BASIC ===\n")

// BASIC throw and catch
console.log("--- Basic throw and catch ---\n")

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed")
  }
  return a / b
}

// Without try/catch: program would crash
// With try/catch: we handle the error gracefully

try {
  console.log("10 / 2 =", divide(10, 2)) // Works fine: 5
  console.log("10 / 0 =", divide(10, 0)) // Throws!
  console.log("This line never runs") // Skipped!
} catch (error) {
  console.log("Caught error:", error.message)
}

console.log("Program continues after try/catch\n")

// WHAT HAPPENS WITHOUT try/catch:
console.log("--- Uncaught errors crash the program ---\n")
console.log("(Demonstrating with safe wrapper)")

function unsafeOperation() {
  const obj = null
  return obj.property // TypeError: Cannot read property of null
}

// Catching it so our program doesn't crash:
try {
  unsafeOperation()
} catch (error) {
  console.log("TypeError caught:", error.message)
  console.log("Error type:", error.constructor.name)
}

console.log()

// ========================================
// SECTION 6: EXCEPTION TYPES
// ========================================

/*
JAVASCRIPT BUILT-IN ERROR TYPES:

Error         - Generic error (base class)
TypeError     - Wrong type used
RangeError    - Value out of valid range
ReferenceError- Variable doesn't exist
SyntaxError   - Invalid JavaScript syntax
URIError      - Invalid URI
EvalError     - Problem with eval() (rare)

Each has:
- .message  (string description)
- .name     (error type name)
- .stack    (call stack trace)
*/

console.log("=== SECTION 6: EXCEPTION TYPES ===\n")

const errorExamples = [
  // [description, function that throws]
  [
    "TypeError: wrong type",
    () => {
      null.property
    },
  ],
  [
    "RangeError: value out of range",
    () => {
      new Array(-1)
    },
  ],
  [
    "ReferenceError: variable not declared",
    () => {
      console.log(nonExistentVariable)
    },
  ],
]

for (const [description, fn] of errorExamples) {
  try {
    fn()
  } catch (error) {
    console.log(`${description}`)
    console.log(`  error.name:    ${error.name}`)
    console.log(`  error.message: ${error.message}`)
    console.log(`  error.stack:   (first line) ${error.stack.split("\n")[0]}`)
    console.log()
  }
}

// ========================================
// SECTION 7: CUSTOM ERROR CLASSES
// ========================================

/*
CONCEPT: Custom Errors

You can create your own error types by extending Error.
This allows:
- More descriptive error names
- Additional properties (like error codes)
- Selective catching (catch only specific error types)
- Better error hierarchy in large applications

SYNTAX:
class MyError extends Error {
  constructor(message) {
    super(message)         // Call parent Error constructor
    this.name = "MyError"  // Set name to your class name
  }
}
*/

console.log("=== SECTION 7: CUSTOM ERROR CLASSES ===\n")

// Custom error for validation failures
class ValidationError extends Error {
  constructor(message, field) {
    super(message) // Pass message to Error
    this.name = "ValidationError"
    this.field = field // Extra property: which field failed
  }
}

// Custom error for network failures
class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = "NetworkError"
    this.statusCode = statusCode
  }
}

// Custom error for database failures
class DatabaseError extends Error {
  constructor(message, query) {
    super(message)
    this.name = "DatabaseError"
    this.query = query
  }
}

// Using custom errors
function validateUser(user) {
  if (!user.name || user.name.trim() === "") {
    throw new ValidationError("Name is required", "name")
  }
  if (!user.email || !user.email.includes("@")) {
    throw new ValidationError("Email must be valid", "email")
  }
  if (user.age < 0 || user.age > 150) {
    throw new RangeError(`Age ${user.age} is out of valid range`)
  }
  return true
}

// Test custom errors
const testUsers = [
  { name: "", email: "test@test.com", age: 25 },
  { name: "John", email: "invalidemail", age: 25 },
  { name: "John", email: "john@test.com", age: -5 },
  { name: "John", email: "john@test.com", age: 25 },
]

console.log("Testing validateUser with custom errors:\n")

for (const user of testUsers) {
  try {
    validateUser(user)
    console.log(`✓ Valid user: ${user.name} (${user.email})`)
  } catch (error) {
    if (error instanceof ValidationError) {
      // Catch specifically ValidationError
      console.log(`✗ ValidationError on field '${error.field}': ${error.message}`)
    } else if (error instanceof RangeError) {
      // Catch specifically RangeError
      console.log(`✗ RangeError: ${error.message}`)
    } else {
      // Re-throw unknown errors (don't swallow them!)
      throw error
    }
  }
}

console.log()

// ========================================
// SECTION 8: ERROR PROPAGATION
// ========================================

/*
CONCEPT: Error Propagation

When a function encounters an error, it has choices:
1. Handle it internally (fix and continue)
2. Throw it upward (let caller handle)
3. Wrap it in a more descriptive error

PROPAGATION means letting the error travel up the call stack.
The error propagates until something catches it or crashes.

WHEN TO PROPAGATE:
- Current function doesn't have context to handle the error
- Caller needs to know something went wrong
- Error needs to be transformed to more meaningful message

WHEN TO CATCH LOCALLY:
- Function can recover from the error
- Error is expected and handleable
- You need to clean up resources (finally block)
*/

console.log("=== SECTION 8: ERROR PROPAGATION ===\n")

// Simulating a data pipeline where errors propagate

function fetchRawData(source) {
  // Simulate different data sources
  if (source === "invalid") {
    throw new NetworkError("Cannot connect to source", 404)
  }
  if (source === "empty") {
    return null
  }
  return { values: [1, 2, 3, 4, 5], source }
}

function processData(data) {
  if (data === null) {
    throw new ValidationError("No data to process", "data")
  }
  // Process the data
  return {
    average: data.values.reduce((a, b) => a + b) / data.values.length,
    count: data.values.length,
    source: data.source,
  }
}

function generateReport(processed) {
  return `
    Report from: ${processed.source}
    Count: ${processed.count}
    Average: ${processed.average}
  `
}

// Top-level function: handles all errors from pipeline
function runDataPipeline(source) {
  // Only ONE try/catch needed at the top level
  // Errors propagate naturally from fetchRawData and processData
  try {
    const raw = fetchRawData(source) // Might throw NetworkError
    const processed = processData(raw) // Might throw ValidationError
    const report = generateReport(processed)
    return { success: true, report }
  } catch (error) {
    // Handle different error types differently
    if (error instanceof NetworkError) {
      return {
        success: false,
        error: `Network failed (${error.statusCode}): ${error.message}`,
      }
    } else if (error instanceof ValidationError) {
      return {
        success: false,
        error: `Data invalid (${error.field}): ${error.message}`,
      }
    } else {
      // Unknown error: re-throw (don't swallow unexpected errors!)
      throw error
    }
  }
}

// Test propagation
const sources = ["valid-source", "invalid", "empty"]

for (const source of sources) {
  const result = runDataPipeline(source)
  console.log(`Pipeline result for "${source}":`)
  if (result.success) {
    console.log("  Success:", result.report.trim())
  } else {
    console.log("  Failed:", result.error)
  }
  console.log()
}

// ========================================
// SECTION 9: TRY / CATCH / FINALLY
// ========================================

/*
CONCEPT: finally block

finally ALWAYS runs:
- Whether try succeeded
- Whether catch ran
- Even if try or catch has a return statement!

USE CASES:
- Clean up resources (close files, database connections)
- Release locks
- Stop loading spinners
- Log completion regardless of success/failure

IMPORTANT: finally runs even with return!
*/

console.log("=== SECTION 9: TRY / CATCH / FINALLY ===\n")

// Demonstrating finally always runs
function demonstrateFinally(shouldThrow) {
  console.log(`demonstrateFinally(${shouldThrow}):`)

  try {
    console.log("  try: Starting...")
    if (shouldThrow) {
      throw new Error("Intentional error")
    }
    console.log("  try: No error, completing normally")
    return "success"
  } catch (error) {
    console.log("  catch: Handling error:", error.message)
    return "error handled"
  } finally {
    // This ALWAYS runs, even with return statements above
    console.log("  finally: ALWAYS runs (cleanup here)")
  }
}

console.log(demonstrateFinally(false))
console.log()
console.log(demonstrateFinally(true))
console.log()

// Real-world finally example: resource cleanup
class DatabaseConnection {
  constructor(name) {
    this.name = name
    this.isOpen = false
  }

  open() {
    this.isOpen = true
    console.log(`  [DB] Connection '${this.name}' opened`)
  }

  query(sql) {
    if (!this.isOpen) throw new Error("Connection not open")
    if (sql.includes("DROP")) throw new Error("Dangerous query blocked!")
    return `Results for: ${sql}`
  }

  close() {
    this.isOpen = false
    console.log(`  [DB] Connection '${this.name}' closed`)
  }
}

function runQuery(sql) {
  const db = new DatabaseConnection("main")

  try {
    db.open()
    const results = db.query(sql)
    console.log("  Query results:", results)
    return results
  } catch (error) {
    console.log("  Query failed:", error.message)
    return null
  } finally {
    // ALWAYS close the connection!
    // Even if query throws, connection gets closed
    db.close()
  }
}

console.log("Safe query:")
runQuery("SELECT * FROM users")
console.log()

console.log("Dangerous query (throws, but finally still closes connection):")
runQuery("DROP TABLE users")
console.log()

// ========================================
// SECTION 10: SELECTIVE CATCHING
// ========================================

/*
CONCEPT: Selective Catching

Don't catch ALL errors - only catch what you can handle!

BAD PRACTICE: Catching everything silently
try {
  doSomething()
} catch (e) {
  // Swallowing ALL errors, including unexpected ones!
  // This hides bugs!
}

GOOD PRACTICE: Catch only specific, expected errors
try {
  doSomething()
} catch (e) {
  if (e instanceof ExpectedError) {
    // Handle it
  } else {
    throw e  // Re-throw unexpected errors!
  }
}

WHY?
- Unexpected errors are BUGS
- Swallowing them hides bugs
- Re-throwing lets them propagate to appropriate handler
*/

console.log("=== SECTION 10: SELECTIVE CATCHING ===\n")

// Example: Meadowfield robot with error handling

class InputError extends Error {
  constructor(message) {
    super(message)
    this.name = "InputError"
  }
}

function parseDirection(input) {
  const validDirections = [
    "Alice's House",
    "Bob's House",
    "Town Hall",
    "Post Office",
    "Marketplace",
    "Farm",
    "Shop",
    "Cabin",
    "Daria's House",
    "Ernie's House",
    "Grete's House",
  ]

  if (typeof input !== "string") {
    throw new TypeError(`Direction must be a string, got ${typeof input}`)
  }

  // Find case-insensitive match
  const match = validDirections.find((d) => d.toLowerCase() === input.toLowerCase())

  if (!match) {
    throw new InputError(`Unknown location: "${input}"`)
  }

  return match
}

// Selective catching in action
const testDirections = [
  "town hall", // Valid (case insensitive)
  "FARM", // Valid (case insensitive)
  "Atlantis", // InputError (unknown)
  123, // TypeError (wrong type)
  "Alice's House", // Valid
]

console.log("Testing parseDirection with selective catching:\n")

for (const dir of testDirections) {
  try {
    const result = parseDirection(dir)
    console.log(`✓ "${dir}" → "${result}"`)
  } catch (error) {
    if (error instanceof InputError) {
      // Expected error: unknown location
      console.log(`✗ InputError: ${error.message}`)
    } else if (error instanceof TypeError) {
      // Expected error: wrong type
      console.log(`✗ TypeError: ${error.message}`)
    } else {
      // Unexpected error: re-throw!
      console.log(`  Re-throwing unexpected: ${error.name}`)
      throw error
    }
  }
}

console.log()

// ========================================
// SECTION 11: ASSERTIONS
// ========================================

/*
CONCEPT: Assertions

An assertion is a check that something MUST be true.
If the assertion fails, it means there's a BUG in the code.

Unlike user input validation (which handles external errors),
assertions catch PROGRAMMER errors (things that should never happen).

USES:
- Verify function inputs (developer contract)
- Check invariants (conditions that must always hold)
- Document assumptions in code
- Find bugs during development

Node.js has built-in assert module.
We'll also build our own lightweight version.
*/

console.log("=== SECTION 11: ASSERTIONS ===\n")

// Custom assertion function
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

function assertEqual(actual, expected, message = "") {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed: Expected ${JSON.stringify(expected)} ` +
        `but got ${JSON.stringify(actual)}` +
        (message ? ` - ${message}` : ""),
    )
  }
}

function assertThrows(fn, errorType, message = "") {
  try {
    fn()
    throw new Error(`Assertion failed: Expected ${errorType.name} to be thrown` + (message ? ` - ${message}` : ""))
  } catch (error) {
    if (!(error instanceof errorType)) {
      throw new Error(
        `Assertion failed: Expected ${errorType.name} but got ${error.constructor.name}` + (message ? ` - ${message}` : ""),
      )
    }
  }
}

// Using assertions to test functions
console.log("Running assertions:\n")

// Test compressString (from our previous exercises)
function compressString(str) {
  if (str.length === 0) return ""

  let result = ""
  let count = 1

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++
    } else {
      result += str[i - 1] + count
      count = 1
    }
  }

  return result.length < str.length ? result : str
}

// Assertions for compressString
try {
  assertEqual(compressString("aaabbc"), "a3b2c1", "basic compression")
  console.log("✓ compressString('aaabbc') === 'a3b2c1'")

  assertEqual(compressString("abc"), "abc", "no compression needed")
  console.log("✓ compressString('abc') === 'abc' (no compression)")

  assertEqual(compressString(""), "", "empty string")
  console.log("✓ compressString('') === ''")

  assertEqual(compressString("aaaaaaaaaa"), "a10", "double digit count")
  console.log("✓ compressString('aaaaaaaaaa') === 'a10'")

  assert(typeof compressString("test") === "string", "always returns string")
  console.log("✓ compressString always returns string")

  assertThrows(
    () => {
      throw new InputError("test")
    },
    InputError,
    "custom error throws correctly",
  )
  console.log("✓ InputError throws correctly")

  console.log("\nAll assertions passed! ✅")
} catch (error) {
  console.log("Assertion failed! ❌")
  console.log(error.message)
}

console.log()

// ========================================
// SECTION 12: DEFENSIVE PROGRAMMING
// ========================================

/*
CONCEPT: Defensive Programming

Write code that handles unexpected inputs gracefully.
Assume users will provide wrong data.
Assume network will fail.
Assume files won't exist.

PRINCIPLES:
1. Validate inputs at the boundary (when data enters your system)
2. Use sensible defaults
3. Fail fast (throw immediately when something is wrong)
4. Be specific in error messages
5. Never trust external data
*/

console.log("=== SECTION 12: DEFENSIVE PROGRAMMING ===\n")

// Example: Defensively programmed robot state manager

class RobotStateManager {
  // Known village locations
  static VALID_LOCATIONS = new Set([
    "Alice's House",
    "Bob's House",
    "Town Hall",
    "Post Office",
    "Marketplace",
    "Farm",
    "Shop",
    "Cabin",
    "Daria's House",
    "Ernie's House",
    "Grete's House",
  ])

  constructor(initialLocation = "Post Office") {
    // Validate initial location
    this._validateLocation(initialLocation, "initialLocation")

    this._location = initialLocation
    this._parcels = []
    this._moveHistory = []
  }

  // Private validation method
  _validateLocation(location, paramName) {
    if (typeof location !== "string") {
      throw new TypeError(`${paramName} must be a string, got ${typeof location}`)
    }
    if (!RobotStateManager.VALID_LOCATIONS.has(location)) {
      throw new InputError(`${paramName} "${location}" is not a valid village location`)
    }
  }

  _validateParcel(parcel) {
    if (typeof parcel !== "object" || parcel === null) {
      throw new TypeError("Parcel must be an object")
    }
    if (!parcel.place || !parcel.address) {
      throw new ValidationError("Parcel must have 'place' and 'address' properties", "parcel")
    }
    this._validateLocation(parcel.place, "parcel.place")
    this._validateLocation(parcel.address, "parcel.address")
    if (parcel.place === parcel.address) {
      throw new ValidationError("Parcel place and address cannot be the same", "parcel")
    }
  }

  addParcel(parcel) {
    this._validateParcel(parcel)
    this._parcels.push({ ...parcel }) // Copy (immutable principle)
    return this
  }

  moveTo(location) {
    this._validateLocation(location, "location")

    const previousLocation = this._location
    this._location = location
    this._moveHistory.push({ from: previousLocation, to: location })

    return this
  }

  get location() {
    return this._location
  }
  get parcels() {
    return [...this._parcels]
  } // Return copy
  get moveCount() {
    return this._moveHistory.length
  }

  getStatus() {
    return {
      location: this._location,
      parcelCount: this._parcels.length,
      moveCount: this._moveHistory.length,
    }
  }
}

console.log("Testing defensively programmed RobotStateManager:\n")

// Valid usage
try {
  const manager = new RobotStateManager("Post Office")

  manager.addParcel({
    place: "Alice's House",
    address: "Town Hall",
  })

  manager.moveTo("Alice's House")
  manager.moveTo("Town Hall")

  console.log("✓ Valid usage works:")
  console.log("  Status:", manager.getStatus())
} catch (error) {
  console.log("Unexpected error:", error.message)
}

console.log()

// Invalid usage - all caught gracefully
const invalidTests = [
  {
    description: "Invalid initial location",
    fn: () => new RobotStateManager("Atlantis"),
  },
  {
    description: "Non-string location",
    fn: () => {
      const m = new RobotStateManager()
      m.moveTo(123)
    },
  },
  {
    description: "Missing parcel fields",
    fn: () => {
      const m = new RobotStateManager()
      m.addParcel({ place: "Farm" }) // Missing address
    },
  },
  {
    description: "Same place and address",
    fn: () => {
      const m = new RobotStateManager()
      m.addParcel({ place: "Farm", address: "Farm" })
    },
  },
]

for (const { description, fn } of invalidTests) {
  try {
    fn()
    console.log(`✗ Should have thrown: ${description}`)
  } catch (error) {
    console.log(`✓ ${description}`)
    console.log(`  ${error.name}: ${error.message}`)
  }
}

console.log()

// ========================================
// SECTION 13: ERROR HANDLING PATTERNS
// ========================================

/*
COMMON ERROR HANDLING PATTERNS:

1. TRY/CATCH (synchronous)
2. ERROR RETURN VALUES (alternative to exceptions)
3. RESULT OBJECT PATTERN { success, data, error }
4. DEFAULT VALUES (nullish coalescing)

Each has its place. Know when to use which.
*/

console.log("=== SECTION 13: ERROR HANDLING PATTERNS ===\n")

// PATTERN 1: Traditional try/catch
console.log("Pattern 1: try/catch")
function parseJsonSafe(str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

console.log(parseJsonSafe('{"name": "John"}')) // { name: 'John' }
console.log(parseJsonSafe("invalid json")) // null
console.log()

// PATTERN 2: Result object
console.log("Pattern 2: Result object { success, data, error }")

function parseJsonResult(str) {
  try {
    const data = JSON.parse(str)
    return { success: true, data, error: null }
  } catch (e) {
    return { success: false, data: null, error: e.message }
  }
}

const result1 = parseJsonResult('{"name": "John"}')
const result2 = parseJsonResult("invalid json")

console.log("Valid JSON result:", result1)
console.log("Invalid JSON result:", result2)
console.log()

// PATTERN 3: Nullish coalescing with defaults
console.log("Pattern 3: Nullish coalescing (??) for defaults")

function getRobotConfig(config) {
  return {
    // Use provided value OR default if null/undefined
    startLocation: config?.startLocation ?? "Post Office",
    parcelCount: config?.parcelCount ?? 5,
    maxSteps: config?.maxSteps ?? 100,
    strategy: config?.strategy ?? "random",
  }
}

console.log("No config:", getRobotConfig(null))
console.log("Partial config:", getRobotConfig({ parcelCount: 3 }))
console.log(
  "Full config:",
  getRobotConfig({
    startLocation: "Farm",
    parcelCount: 10,
    maxSteps: 50,
    strategy: "optimized",
  }),
)
console.log()

// ========================================
// SECTION 14: COMPLETE EXAMPLE
// ========================================

/*
Putting it all together:
A robust robot simulation with proper error handling.
*/

console.log("=== SECTION 14: COMPLETE EXAMPLE ===")
console.log("Robust robot simulation with full error handling\n")

// Reusing roadGraph from Chapter 7 concepts
const ROAD_GRAPH = {
  "Alice's House": ["Bob's House", "Cabin", "Post Office"],
  "Bob's House": ["Alice's House", "Town Hall"],
  Cabin: ["Alice's House"],
  "Post Office": ["Alice's House", "Marketplace"],
  "Town Hall": ["Bob's House", "Daria's House", "Marketplace", "Shop"],
  "Daria's House": ["Ernie's House", "Town Hall"],
  "Ernie's House": ["Daria's House", "Grete's House"],
  "Grete's House": ["Ernie's House", "Farm", "Shop"],
  Farm: ["Grete's House", "Marketplace"],
  Shop: ["Grete's House", "Marketplace", "Town Hall"],
  Marketplace: ["Farm", "Post Office", "Shop", "Town Hall"],
}

class RobustRobot {
  constructor(config = {}) {
    const defaults = {
      startLocation: "Post Office",
      maxSteps: 200,
      verbose: false,
    }

    const settings = { ...defaults, ...config }

    // Validate settings
    if (!ROAD_GRAPH[settings.startLocation]) {
      throw new InputError(`Invalid start location: "${settings.startLocation}"`)
    }

    if (typeof settings.maxSteps !== "number" || settings.maxSteps < 1) {
      throw new RangeError("maxSteps must be a positive number")
    }

    this.location = settings.startLocation
    this.maxSteps = settings.maxSteps
    this.verbose = settings.verbose
    this.steps = 0
    this.parcels = []
  }

  addParcel(place, address) {
    // Validate both locations
    if (!ROAD_GRAPH[place]) {
      throw new InputError(`Invalid parcel place: "${place}"`)
    }
    if (!ROAD_GRAPH[address]) {
      throw new InputError(`Invalid parcel address: "${address}"`)
    }
    if (place === address) {
      throw new ValidationError("Parcel place and address must be different", "address")
    }

    this.parcels.push({ place, address, id: this.parcels.length + 1 })
    return this
  }

  _findRoute(from, to) {
    if (from === to) return []

    const work = [{ at: from, route: [] }]
    const visited = new Set([from])

    while (work.length > 0) {
      const { at, route } = work.shift()
      for (const next of ROAD_GRAPH[at]) {
        if (next === to) return [...route, next]
        if (!visited.has(next)) {
          visited.add(next)
          work.push({ at: next, route: [...route, next] })
        }
      }
    }

    throw new Error(`No route from "${from}" to "${to}"`)
  }

  _chooseNextMove() {
    let bestRoute = null

    for (const parcel of this.parcels) {
      const target =
        parcel.place !== this.location
          ? parcel.place // Go pick up
          : parcel.address // Go deliver

      const route = this._findRoute(this.location, target)

      if (bestRoute === null || route.length < bestRoute.length) {
        bestRoute = route
      }
    }

    return bestRoute
  }

  run() {
    const deliveredLog = []

    while (this.parcels.length > 0) {
      // Safety check: prevent infinite loops
      if (this.steps >= this.maxSteps) {
        throw new RangeError(`Robot exceeded maxSteps (${this.maxSteps}). ` + `${this.parcels.length} parcels undelivered.`)
      }

      // Choose next destination
      const route = this._chooseNextMove()

      if (!route || route.length === 0) {
        throw new Error("Robot has no valid moves")
      }

      const nextLocation = route[0]
      this.location = nextLocation
      this.steps++

      if (this.verbose) {
        console.log(`  Step ${this.steps}: Moved to ${nextLocation}`)
      }

      // Pick up parcels at current location
      this.parcels = this.parcels.map((parcel) => {
        if (parcel.place === this.location) {
          if (this.verbose) console.log(`  📦 Picked up parcel #${parcel.id}`)
          return { ...parcel, place: this.location }
        }
        return parcel
      })

      // Deliver parcels at their address
      const toDeliver = this.parcels.filter((p) => {
        return p.place === this.location && p.address === this.location
      })

      for (const parcel of toDeliver) {
        deliveredLog.push({
          id: parcel.id,
          address: parcel.address,
          stepDelivered: this.steps,
        })
        if (this.verbose) {
          console.log(`  ✅ Delivered parcel #${parcel.id} to ${parcel.address}`)
        }
      }

      this.parcels = this.parcels.filter((p) => !(p.place === this.location && p.address === this.location))
    }

    return {
      success: true,
      totalSteps: this.steps,
      delivered: deliveredLog,
    }
  }
}

// Test the robust robot
try {
  const robot = new RobustRobot({
    startLocation: "Post Office",
    maxSteps: 200,
    verbose: true,
  })

  robot.addParcel("Alice's House", "Town Hall").addParcel("Farm", "Post Office").addParcel("Shop", "Cabin")

  console.log("Starting robot simulation...")
  console.log(`Location: ${robot.location}`)
  console.log(`Parcels: ${robot.parcels.length}\n`)

  const result = robot.run()

  console.log("\nSimulation complete!")
  console.log(`Total steps: ${result.totalSteps}`)
  console.log("Delivery log:")
  for (const d of result.delivered) {
    console.log(`  Parcel #${d.id} → ${d.address} (step ${d.stepDelivered})`)
  }
} catch (error) {
  console.error("Robot simulation failed:", error.message)
}

console.log()

// Test with invalid config
console.log("Testing invalid configurations:\n")

const invalidConfigs = [
  {
    description: "Invalid start location",
    fn: () => new RobustRobot({ startLocation: "Narnia" }),
  },
  {
    description: "Invalid maxSteps",
    fn: () => new RobustRobot({ maxSteps: -5 }),
  },
  {
    description: "Same place and address",
    fn: () => new RobustRobot().addParcel("Farm", "Farm"),
  },
]

for (const { description, fn } of invalidConfigs) {
  try {
    fn()
  } catch (error) {
    console.log(`✓ ${description}`)
    console.log(`  ${error.name}: ${error.message}`)
  }
}

// ========================================
// SECTION 15: SUMMARY
// ========================================

console.log(`
========================================
CHAPTER 8 SUMMARY: BUGS AND ERRORS
========================================

WHAT YOU LEARNED:

1. STRICT MODE ("use strict")
   - Prevents silent errors becoming hidden bugs
   - Always use it in professional code
   - ES6 modules/classes are strict by default

2. TYPE COERCION BUGS
   - Use === not == (always!)
   - Use Number.isNaN() not isNaN()
   - Be careful with + operator (string vs number)
   - Validate types at function boundaries

3. DEBUGGING TECHNIQUES
   - console.log(), console.table(), console.error()
   - console.time() for performance
   - Systematic isolation of bugs
   - Defensive programming mindset

4. EXCEPTIONS (throw/try/catch/finally)
   - throw: signal something went wrong
   - try: code that might throw
   - catch: handle the error
   - finally: always runs (cleanup)

5. CUSTOM ERROR CLASSES
   - Extend Error for meaningful error types
   - Add extra properties (field, statusCode, etc.)
   - Enables selective catching by type

6. ERROR PROPAGATION
   - Errors travel up the call stack
   - Catch only what you can handle
   - Re-throw unexpected errors (don't swallow!)
   - One try/catch at the right level

7. SELECTIVE CATCHING
   - Use instanceof to check error type
   - Never catch all errors silently
   - Re-throw what you can't handle

8. ASSERTIONS
   - Verify programmer assumptions
   - Catch bugs during development
   - Document expected behavior

9. DEFENSIVE PROGRAMMING
   - Validate all external inputs
   - Fail fast with clear messages
   - Use sensible defaults
   - Never trust external data

10. ERROR HANDLING PATTERNS
    - try/catch (synchronous)
    - Result object { success, data, error }
    - Nullish coalescing ?? for defaults
    - Optional chaining ?. for safe access

========================================
CONNECTION TO YOUR CAREER GOALS
========================================

These concepts directly apply to:

REACT DEVELOPMENT:
  - Error Boundaries (catch React rendering errors)
  - Form validation (ValidationError pattern)
  - API error handling (NetworkError pattern)
  - Loading/error states in components

FULL STACK OPEN:
  - Part 3: Express server error handling
  - Part 4: Testing (assertions)
  - Part 5: Frontend error handling

JOB INTERVIEWS:
  - "How do you handle errors in JavaScript?"
  - "What's the difference between throw and return?"
  - "When would you create a custom Error class?"
  - "What is error propagation?"

PORTFOLIO PROJECTS:
  - Robust error handling = professional code
  - Custom errors = senior developer skill
  - Defensive programming = production-ready code

========================================
NEXT: Chapter 9 - Regular Expressions
  Everything about RegExp you studied
  in your string exercises!
========================================
`)
