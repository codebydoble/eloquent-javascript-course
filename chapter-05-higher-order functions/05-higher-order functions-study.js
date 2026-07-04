/**
 * Chapter 5 — Higher-Order Functions (HOF)
 * Study file for VSCode
 * Author: Yoandy Doble Herrera
 * Date: 26/05/2026
 *
 * HOW TO USE THIS FILE:
 * 1. Read each concept block carefully
 * 2. Run with: node ch5-study.js
 * 3. Complete each TODO exercise before reading the solution below it
 * 4. Try to solve from memory first — check the solution only after attempting
 *
 * CONCEPTS COVERED:
 * ─ What is a higher-order function?
 * ─ forEach
 * ─ filter
 * ─ map
 * ─ reduce
 * ─ Function composition
 * ─ Eloquent JS Ch.5 exercises (flatMap, your own loop, dominant writing direction)
 */
"use strict"
// ═══════════════════════════════════════════════════════════
// CONCEPT 1 — What is a Higher-Order Function?
// ═══════════════════════════════════════════════════════════
/*
  A higher-order function is a function that either:
  - TAKES another function as an argument, or
  - RETURNS a function

  You already use them: forEach, map, filter, reduce are all HOF.
  You also wrote one: commons() in Hello JS took a predicate to filter.

  WHY THIS MATTERS FOR REACT:
  - Event handlers: onClick={handleClick} — you pass a function
  - Array rendering: items.map(item => <Item key={item.id} />)
  - useEffect, useState callbacks are all HOF patterns
*/

// Simple example — repeat() takes a function and runs it N times
const repeat = (n, action) => {
  for (let i = 0; i < n; i++) {
    action(i)
  }
}

repeat(3, console.log)
// 0
// 1
// 2

// ═══════════════════════════════════════════════════════════
// CONCEPT 2 — forEach
// ═══════════════════════════════════════════════════════════
/*
  forEach: iterates over an array and runs a function for each element.
  Returns undefined — it's for SIDE EFFECTS only (logging, mutating external state).
  You already use this well. This is just the formal version.
*/

const languages = ["JavaScript", "TypeScript", "Python", "Rust"]

languages.forEach((lang, index) => {
  console.log(`${index + 1}. ${lang}`)
})
// 1. JavaScript
// 2. TypeScript
// ...

console.log("\n============================================\n")
// TODO 1: Use forEach to print each language in UPPERCASE
// Your code here:
languages.forEach((language, index) => {
  console.log(`${index + 1}. ${language.toUpperCase()}`)
})

// SOLUTION (try first!):
// languages.forEach(lang => console.log(lang.toUpperCase()))

// ═══════════════════════════════════════════════════════════
// CONCEPT 3 — filter
// ═══════════════════════════════════════════════════════════
/*
  filter: returns a NEW array with only the elements where the callback returns true.
  Does NOT mutate the original. Pure function — you did this manually in loops before.

  Pattern:
    array.filter(element => condition)

  Think of it as: "give me only the elements where this is true"
*/

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const evens = numbers.filter((n) => n % 2 === 0)
console.log("\nfilter evens:", evens) // [2, 4, 6, 8, 10]

const biggerThan5 = numbers.filter((n) => n > 5)
console.log("filter > 5:", biggerThan5) // [6, 7, 8, 9, 10]

// You can chain filter with other methods
const evensBiggerThan5 = numbers.filter((n) => n % 2 === 0 && n > 5)
console.log("evens > 5:", evensBiggerThan5) // [6, 8, 10]

// TODO 2: From the languages array, filter only languages that contain the letter "t" (case insensitive)
// Your code here:
const languagesWithT = languages.filter((language) => language.toLowerCase().includes("t"))

// SOLUTION:
// const withT = languages.filter(lang => lang.toLowerCase().includes("t"))
// console.log(withT) // ["JavaScript", "TypeScript"]

// ─── Connection to your previous work ───────────────────────
// Your loops exercise 10 (Hello JS) — the manual version:
let manual = []
numbers.forEach((n) => {
  if (n > 10) manual.push(n)
})

// The HOF version — same result, less code:
const filtered = numbers.filter((n) => n > 10) // [] — none > 10 in this array

// From your Ch.4 range:
const range1to10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const biggerThan10range = range1to10.filter((n) => n > 5)
console.log("filter range > 5:", biggerThan10range)

// ═══════════════════════════════════════════════════════════
// CONCEPT 4 — map
// ═══════════════════════════════════════════════════════════
/*
  map: returns a NEW array where EVERY element is transformed by the callback.
  One-to-one: input array has N elements → output array has N elements.
  Does NOT mutate the original.

  Pattern:
    array.map(element => transformation)

  Think of it as: "transform every element into something new"
*/

const doubled = numbers.map((n) => n * 2)
console.log("\nmap doubled:", doubled) // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

const squared = numbers.map((n) => n ** 2)
console.log("map squared:", squared) // [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

// map with objects
const people = [
  { name: "Yoandy", age: 25 },
  { name: "Kevin", age: 30 },
  { name: "Alice", age: 22 },
]
const names = people.map((person) => person.name)
console.log("map names:", names) // ["Yoandy", "Kevin", "Alice"]

const withSenior = people.map((person) => ({
  ...person,
  isSenior: person.age >= 30,
}))
console.log("map with isSenior:", withSenior)

// TODO 3: Using your range() from Ch.4, create a range from 1 to 5
//         then map it to its factorial using your factorial function from Hello JS
// Your code here:
/**
 * Función range que tome dos argumentos, inicio y fin, y devuelva un array
 * que contenga todos los números desde inicio hasta fin, incluyendo fin.
 * Acepta un tercer argumento opcional para el paso (step).
 * @param {Number} init número de inicio.
 * @param {Number} end número final (inclusive).
 * @param {Number} paso paso entre cada número. Default: 1.
 * @returns {Array} array con los números del rango.
 */
const range = function (init, end, paso = 1) {
  let result = []
  if (init > end && paso < 0) {
    // Rango descendente: ej. range(5, 2, -1) → [5, 4, 3, 2]
    for (let index = init; index >= end; index += paso) {
      result.push(index)
    }
  } else {
    // Rango ascendente: ej. range(1, 5) → [1, 2, 3, 4, 5]
    for (let index = init; index <= end; index += paso) {
      result.push(index)
    }
  }
  return result
}

/**
 * Calcula el factorial de un número.
 * @param {number} aNumber El número del que se calculará el factorial.
 * @returns {number} El factorial del número.
 */
const factorial = (aNumber) => {
  return aNumber === 0 ? 1 : factorial(aNumber - 1) * aNumber
}
console.log(range(1, 5).map((num) => factorial(num)))

// SOLUTION:
// const factorial = n => n === 0 ? 1 : factorial(n - 1) * n
// const range = (a, b) => Array.from({length: b - a + 1}, (_, i) => i + a)
// console.log(range(1, 5).map(factorial)) // [1, 2, 6, 24, 120]

// ─── Connection to your previous work ───────────────────────
// Your Hello JS functions exercise 8 — manual version:
const toSqrtManual = (arr) => {
  let result = []
  arr.forEach((n) => result.push(Math.pow(n, 2)))
  return result
}
// HOF version — same result:
const toSqrtHOF = (arr) => arr.map((n) => n ** 2)
console.log("toSqrtHOF:", toSqrtHOF([5, 66, 11]))

// ═══════════════════════════════════════════════════════════
// CONCEPT 5 — reduce
// ═══════════════════════════════════════════════════════════
/*
  reduce: combines ALL elements into a SINGLE value using an accumulator.
  The most powerful and flexible of the three — filter and map can both
  be built from reduce.

  Pattern:
    array.reduce((accumulator, currentValue) => newAccumulator, initialValue)

  The accumulator starts as initialValue, then gets updated on each iteration.
  Think of it as: "fold the whole array into one thing"
*/

// Sum — you wrote this manually in Ch.4!
const total = numbers.reduce((acc, n) => acc + n, 0)
console.log("\nreduce sum:", total) // 55

// Product
const product = [1, 2, 3, 4, 5].reduce((acc, n) => acc * n, 1)
console.log("reduce product:", product) // 120

// Max value — your maxNumber from Hello JS
const max = numbers.reduce((acc, n) => (n > acc ? n : acc), -Infinity)
console.log("reduce max:", max) // 10

// Count vowels — your countVocals from Hello JS
const vowels = new Set(["a", "e", "i", "o", "u"])
const sentence = "JavaScript is a programming language"
const vocalCount = sentence.split("").reduce((acc, char) => {
  return vowels.has(char) ? acc + 1 : acc
}, 0)
console.log("reduce vowel count:", vocalCount)

// Build an object from an array
const langLengths = languages.reduce((acc, lang) => {
  acc[lang] = lang.length
  return acc
}, {})
console.log("reduce to object:", langLengths)
// { JavaScript: 10, TypeScript: 10, Python: 6, Rust: 4 }

// TODO 4: Use reduce to rewrite your sum() from Ch.4 as a one-liner
// Your code here:
const sumPro = (arr) => arr.reduce((acc, value) => acc + value, 0)
// SOLUTION:
// const sum = arr => arr.reduce((acc, n) => acc + n, 0)
// console.log(sum([1,2,3,4,5])) // 15

// TODO 5: Use reduce to find the longest language name in the languages array
// Your code here:
const longLanguage = languages.reduce((acc, lang) => {
  if (lang.length > acc.length) {
    acc = lang
  }
  return acc
}, "")

console.log(">>>Long word", longLanguage)

// SOLUTION:
const longest = languages.reduce((acc, lang) => (lang.length > acc.length ? lang : acc), "")
console.log(longest) // "JavaScript" or "TypeScript"

// ═══════════════════════════════════════════════════════════
// CONCEPT 6 — Chaining HOF
// ═══════════════════════════════════════════════════════════
/*
  filter, map, and reduce can be chained because filter and map return arrays.
  This is the core pattern in React list rendering.

  Read chains from left to right:
  array → filter → map → reduce
*/

const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

// "Sum of squared even numbers"
const result = data
  .filter((n) => n % 2 === 0) // [4, 2, 6] — keep evens
  .map((n) => n ** 2) // [16, 4, 36] — square each
  .reduce((acc, n) => acc + n, 0) // 56 — sum them
console.log("\nchain filter→map→reduce:", result) // 56

// TODO 6: From the people array, get the names of people under 30, sorted alphabetically
// Your code here:
const under30 = people
  .filter((person) => person.age < 30)
  .map((person) => person.name)
  .sort()
console.log(under30) // ["Alice", "Yoandy"]
// SOLUTION:
// const under30names = people
//   .filter(p => p.age < 30)
//   .map(p => p.name)
//   .sort()
// console.log(under30names) // ["Alice", "Yoandy"]

// ═══════════════════════════════════════════════════════════
// CONCEPT 7 — Functions that return functions (closures)
// ═══════════════════════════════════════════════════════════
/*
  A HOF can RETURN a function. The returned function "closes over"
  the outer function's variables — this is called a closure.

  WHY THIS MATTERS FOR REACT:
  - Event handlers with parameters: onClick={() => handleDelete(item.id)}
  - Custom hooks return functions
  - useCallback returns a memoized function
*/

// multiplier factory — returns a function
const multiplier = (factor) => (number) => number * factor

const double = multiplier(2)
const triple = multiplier(3)
const times10 = multiplier(10)

console.log("\ndouble(5):", double(5)) // 10
console.log("triple(5):", triple(5)) // 15
console.log("times10(5):", times10(5)) // 50

// Practical example: greeter factory
const makeGreeter = (greeting, language) => (name) => `[${language}] ${greeting}, ${name}!`

const greetSpanish = makeGreeter("Hola", "ES")
const greetEnglish = makeGreeter("Hello", "EN")

console.log(greetSpanish("Yoandy")) // [ES] Hola, Yoandy!
console.log(greetEnglish("Kevin")) // [EN] Hello, Kevin!

// TODO 7: Write a function makeCounter(start) that returns a function.
//         Each time the returned function is called, it returns the next number.
// makeCounter(0)() → 0, call again → 1, again → 2 ...
// Your code here:
const makeCounter = (start) => {
  let count = start
  return () => {
    return count++
  }
}
const counter = makeCounter(0)
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())

// SOLUTION:
// const makeCounter = start => {
//   let count = start
//   return () => count++
// }
// const counter = makeCounter(0)
// console.log(counter()) // 0
// console.log(counter()) // 1
// console.log(counter()) // 2

// ═══════════════════════════════════════════════════════════
// ELOQUENT JS — Chapter 5 Exercises
// ═══════════════════════════════════════════════════════════

// ── Exercise 1: Flattening ─────────────────────────────────
/*
  Usa reduce en combinación con concat para "aplanar" un array de arrays
  en un único array que tenga todos los elementos de los arrays originales.
*/
console.log("\n=== Eloquent Ex 1: Flattening ===")

const nested = [[1, 2, 3], [4, 5], [6]]

// TODO: flatten using reduce + concat
// Your code here:
const flattening = (arr) => {
  return arr.reduce((acc, arr) => {
    acc.concat(arr)
    return acc
  }, [])
}

console.log(">>>Exercise 1", flattening(nested))

// SOLUTION:
const flattened = nested.reduce((acc, arr) => acc.concat(arr), [])
console.log("flattened:", flattened) // [1, 2, 3, 4, 5, 6]

// Modern alternative (ES2019+):
console.log("flat():", nested.flat()) // [1, 2, 3, 4, 5, 6]

// ── Exercise 2: Your Own Loop ──────────────────────────────
/*
  Escribe una función de orden superior loop que provea algo como una sentencia for.
  loop(value, test, update, body)
  - Mientras test(value) sea true: ejecuta body(value) y luego value = update(value)
*/
console.log("\n=== Eloquent Ex 2: Your Own Loop ===")

// TODO: implement loop()
// Your code here:

// SOLUTION:
const loop = (value, test, update, body) => {
  for (let v = value; test(v); v = update(v)) {
    body(v)
  }
}

loop(
  0, // start value
  (n) => n < 5, // test: keep going while n < 5
  (n) => n + 1, // update: increment
  console.log, // body: print
)
// 0, 1, 2, 3, 4

// ── Exercise 3: Everything ─────────────────────────────────
/*
  De manera análoga al método some, implementa una función every que tome un
  array y una función predicado como parámetros. Devuelve true si la función
  predicado devuelve true para todos los elementos del array.
  Implementa dos versiones: una con bucle y otra con some.
*/
console.log("\n=== Eloquent Ex 3: Everything ===")

// Version 1: with a loop
/**
 *
 * @param {Array} array
 * @param {Function} predicate
 * @returns
 */
const every = (array, predicate) => {
  // TODO: implement with a loop
  // Your code here:
  for (const element of array) {
    if (!predicate(element)) {
      return false
    }
  }
  return true
  // SOLUTION:
  for (const element of array) {
    if (!predicate(element)) return false
  }
  return true
}

// Version 2: using some (think about De Morgan's law: every = !some(!predicate))
/**
 *
 * @param {Array} array
 * @param {Function} predicate
 * @returns
 */
const everyWithSome = (array, predicate) => {
  // TODO: implement using some
  // Your code here:
  return !array.some((value) => {
    !predicate(value)
  })
  // SOLUTION:
  return !array.some((element) => !predicate(element))
}

console.log(
  "every [2,4,6] even:",
  every([2, 4, 6], (n) => n % 2 === 0),
) // true
console.log(
  "every [2,3,6] even:",
  every([2, 3, 6], (n) => n % 2 === 0),
) // false
console.log(
  "everyWithSome [2,4,6] even:",
  everyWithSome([2, 4, 6], (n) => n % 2 === 0),
) // true
console.log(
  "everyWithSome [2,3,6] even:",
  everyWithSome([2, 3, 6], (n) => n % 2 === 0),
) // false

// ── Bonus: connecting Ch.4 to HOF ─────────────────────────
console.log("\n=== Bonus: Ch.4 sum() rewritten as HOF ===")

// Ch.4 original:
const sumLoop = function (array) {
  let result = 0
  for (const n of array) result += n
  return result
}

// HOF version:
const sumHOF = (array) => array.reduce((acc, n) => acc + n, 0)

// Your range from Ch.4 + sum HOF:
const rangeHOF = (init, end, paso = 1) => {
  const result = []
  if (init > end && paso < 0) {
    for (let i = init; i >= end; i += paso) result.push(i)
  } else {
    for (let i = init; i <= end; i += paso) result.push(i)
  }
  return result
}

console.log("sum(range(1,10)):", sumHOF(rangeHOF(1, 10))) // 55 — same as Ch.4

// Or using Array.from (no loop at all):
const rangeFunctional = (init, end) => Array.from({ length: end - init + 1 }, (_, i) => init + i)

console.log("rangeFunctional(1,10):", rangeFunctional(1, 10))
console.log("sum:", sumHOF(rangeFunctional(1, 10))) // 55

// ═══════════════════════════════════════════════════════════
// QUICK REFERENCE — HOF cheatsheet
// ═══════════════════════════════════════════════════════════
/*
  METHOD    │ INPUT          │ OUTPUT         │ USE WHEN
  ──────────┼────────────────┼────────────────┼──────────────────────────────
  forEach   │ array          │ undefined      │ side effects (log, push, etc.)
  filter    │ array          │ smaller array  │ keeping some elements
  map       │ array          │ same-size array│ transforming every element
  reduce    │ array          │ single value   │ combining everything into one
  some      │ array          │ boolean        │ at least one matches?
  every     │ array          │ boolean        │ do all match?
  find      │ array          │ element/undef  │ first match
  findIndex │ array          │ index/-1       │ index of first match
  flat      │ nested array   │ flat array     │ remove one level of nesting
  flatMap   │ array          │ flat array     │ map + flat in one step

  GOLDEN RULE:
  - Need to transform? → map
  - Need to select? → filter
  - Need one value? → reduce
  - Need a side effect? → forEach
  - Everything else → chain the above
*/
