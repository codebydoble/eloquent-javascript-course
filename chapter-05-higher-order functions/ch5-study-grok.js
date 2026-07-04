"use strict"
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
