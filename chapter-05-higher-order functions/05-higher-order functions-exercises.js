/**
 * Chapter 5 High Order Function HOF
 * Author: Yoandy Doble Herrera
 * Date: 28/05/2026
 */

import { SCRIPTS } from "./scripts.js"
;("use strict")
console.log("\n=== Challenge 1 ===")
const aplanar = [
  [5, 6],
  [10, -8, 8, 6],
  [7, 8, 9, 10],
  [1, 2, 3],
]
let arrays = [[1, 2, 3], [4, 5], [6]]
/**
 * Función para “aplanar” un array de arrays en un único array que contenga todos los elementos de los arrays originales.
 * @param {Array} arr cuaquier arry.
 * @returns {Array} un único array que contenga todos los elementos de los
arrays originales.
 */
const apile = (arr) => {
  return arr.reduce((acc, element) => acc.concat(element), [])
}
console.log(">>> Aplanar: ", apile(aplanar))
console.log(">>> Aplanar: ", apile(arrays))
console.log("\n=== Challenge 2 ===")
/**
 * Función de orden superior loop que proporcione algo similar a una declaración for loop.
 * @param {Number} valor start value.
 * @param {Function} prueba test function Ex. keep going while n < 5.
 * @param {Function} update update function Ex. increment or decrement.
 * @param {Function} cuerpo body function inside action loop: Ex. print
 */
const loop = (valor, prueba, update, cuerpo) => {
  for (let index = valor; prueba(index); index = update(index)) {
    cuerpo(index)
  }
}
console.log("Loop 1")
loop(
  0, // start value
  (n) => n < 5, // test: keep going while n < 5
  (n) => n + 1, // update: increment
  console.log, // body: print
)
console.log("\nLoop 2")
loop(
  3,
  (n) => n > 0,
  (n) => n - 1,
  console.log,
)
console.log("\n=== Challenge 3 ===")
/**
 * Función manual de --every-- análogo al método some. Este método devuelve true cuando la función dada devuelve true para cada elemento en el array. En cierto modo, every es como el operador &&.
Implementa every como una función que recibe un array y una función de
predicado como parámetros. Escribe dos versiones, una usando un bucle y otra
usando el método some.
 * @param {Array} arr any array.
 * @param {Function} predicate test function.
 * @returns {Boolean} return true if predicate is true for every element in array otherwise return false. 
 */
const every = (arr, predicate) => {
  /* Bucle */
  for (const element of arr) {
    if (!predicate(element)) return false
  }
  return true
}

/**
 * Función manual de --every-- análogo al método some. Este método devuelve true cuando la función dada devuelve true para cada elemento en el array. En cierto modo, every es como el operador &&.
Implementa every como una función que recibe un array y una función de
predicado como parámetros. Escribe dos versiones, una usando un bucle y otra
usando el método some.
 * @param {Array} arr any array.
 * @param {Function} predicate test function.
 * @returns {Boolean} return true if predicate is true for every element in array otherwise return false. 
 */
const everyWithSome = (arr, predicate) => {
  /* Some */
  return !arr.some((element) => !predicate(element))
}
console.log(every([1, 2, 3, 5], (n) => n > 5)) // → false
console.log(every([10, 20, 30, 15], (n) => n > 5)) // → true
console.log(every([1, 3, 5], (n) => n < 10)) // → true
console.log(every([2, 4, 16], (n) => n < 10)) // → false
console.log(every([], (n) => n < 10)) // → true
console.log(everyWithSome([1, 2, 3, 5], (n) => n > 5)) // → false
console.log(everyWithSome([10, 20, 30, 15], (n) => n > 5)) // → true

console.log("\n=== Challenge 4 ===")

/**
 * Función que calcule la dirección de escritura dominante en una cadena de texto. Recuerda que cada objeto script tiene una propiedad direction
que puede ser "ltr" (de izquierda a derecha), "rtl" (de derecha a izquierda) o
"ttb" (de arriba a abajo).
 * @param {String} sentence cualquier texto.
 * @returns {String} ltr o rtl
 */
const dominantDirection = (sentence) => {
  // 1. to Arr
  const sentenceToArr = sentence.split("")
  // 2. Reduce create array of obj map [{name:"String", direction: "String", count: Number}]
  const filtred = sentenceToArr.reduce((acc, char) => {
    const charCode = char.charCodeAt(0)
    // 3. Filter SCRIPT obj
    const objFiltered = SCRIPTS.filter((languageObj) => {
      if (
        languageObj.ranges.some(([codeStart, CodeEnd]) => {
          return charCode >= codeStart && charCode < CodeEnd
        })
      ) {
        return languageObj
      }
    }).map((script) => {
      return { name: script.name, direction: script.direction }
    })

    if (objFiltered.length > 0) {
      let known = acc.findIndex((s) => s.name === objFiltered[0].name)
      if (known !== -1) {
        // appears
        acc[known].count++
      } else {
        // not found
        acc.push({ name: objFiltered[0].name, direction: objFiltered[0].direction, count: 1 })
      }
    }
    return acc
  }, [])
  if (filtred.length === 0) {
    return ""
  } else if (filtred.length === 1) {
    return filtred[0].direction
  } else {
    return filtred.sort((a, b) => b.count - a.count)[0].direction
  }
}

const georgianDir = dominantDirection("ასომთავრული, ႠႱႭႫႧႠႥႰႳႪႨ")
console.log(">>>Georgian direction", georgianDir) // → ltr
console.log(dominantDirection("Hello!")) // → ltr
console.log(dominantDirection("Hey, مساء الخير")) // → rtl
