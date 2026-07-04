/**
 * Chapter 4 — Data Structures
 * Author: Yoandy Doble Herrera
 * Fixed by: Claude (review session 26/04/2026)
 *
 * BUGS FIXED:
 * 1. reverseArrayInPlace — was reassigning local var, not mutating original
 * 2. listToArrayPersonal — outer-scope `arr` leaked state across calls
 * 3. prepend — || should be && (null/undefined always passed through)
 * 4. deepEqual — didn't check key count, so extra keys in valueTwo were ignored
 */

// ─────────────────────────────────────────
// CHALLENGE 1 — range() + sum()
// ─────────────────────────────────────────
"use strict"
console.log("\n=== Challenge 1 ===")

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
 * Función sum que tome un array de números y devuelva la suma de estos números.
 * @param {Array} array array de números.
 * @returns {Number} la suma de todos los números.
 */
const sum = function (array) {
  let result = 0
  for (const num of array) {
    result += num
  }
  return result
}

/**
 *
 * @param {Array} arr any numbers array
 * @returns {Number}
 */
const sumPro = (arr) => arr.reduce((acc, value) => acc + value, 0)
// Tests
console.log("range(1, 10):", range(1, 10)) // [1,2,3,4,5,6,7,8,9,10]
console.log("range(5, 2, -1):", range(5, 2, -1)) // [5,4,3,2]
console.log("range(1, 10, 2):", range(1, 10, 2)) // [1,3,5,7,9]
console.log("range(2, 2):", range(2, 2)) // [2]
console.log("range(5, 2):", range(5, 2)) // [] — no step, init > end
console.log("sum(range(1, 10)):", sum(range(1, 10))) // 55

// ─────────────────────────────────────────
// CHALLENGE 2 — reverseArray + reverseArrayInPlace
// ─────────────────────────────────────────
console.log("\n=== Challenge 2 ===")

/**
 * Devuelve un NUEVO array con los elementos en orden inverso.
 * El array original no se modifica.
 * @param {Array} array cualquier array.
 * @returns {Array} nuevo array con los elementos invertidos.
 */
const reverseArray = function (array) {
  let result = []
  for (let index = array.length - 1; index >= 0; index--) {
    result.push(array[index])
  }
  return result
}

/**
 * Invierte el array ORIGINAL en su lugar (in-place), sin crear un nuevo array.
 * Intercambia elementos desde los extremos hacia el centro.
 *
 * BUG ORIGINAL: se hacía array = result, lo cual solo cambia la variable local.
 * El array del caller nunca se mutaba.
 *
 * FIX: intercambiar elementos directamente usando destructuring swap.
 *
 * @param {Array} array cualquier array (será mutado).
 * @returns {void} no devuelve nada — muta el original directamente.
 */
const reverseArrayInPlace = function (array) {
  let left = 0
  let right = array.length - 1
  while (left < right) {
    // Swap sin variable temporal — destructuring assignment
    ;[array[left], array[right]] = [array[right], array[left]]
    left++
    right--
  }
  // Sin return — el array original ya está mutado
}

// Tests
const original = [1, 2, 3, 4, 5]
console.log("reverseArray([1..5]):", reverseArray(original))
console.log("original after reverseArray:", original) // [1,2,3,4,5] — sin cambios ✓

let mutable = [1, 2, 3, 4, 5]
reverseArrayInPlace(mutable)
console.log("mutable after reverseArrayInPlace:", mutable) // [5,4,3,2,1] — mutado ✓

let odd = [1, 2, 3]
reverseArrayInPlace(odd)
console.log("odd length [1,2,3] in-place:", odd) // [3,2,1] ✓

// ─────────────────────────────────────────
// CHALLENGE 3 — Lists
// ─────────────────────────────────────────
console.log("\n=== Challenge 3 ===")

/*
 Una "lista enlazada" en Eloquent JS tiene esta forma:
 {
   value: 1,
   rest: {
     value: 2,
     rest: {
       value: 3,
       rest: null  ← siempre termina en null
     }
   }
 }
*/

// ── arrayToList ──────────────────────────
/**
 * Construye una lista enlazada a partir de un array.
 * Recorre el array de atrás hacia adelante para construir la lista
 * desde el último nodo hasta el primero.
 * @param {Array} array cualquier array.
 * @returns {Object} lista enlazada (objeto anidado).
 */
const arrayToList = function (array) {
  let list = {}
  for (let index = array.length - 1; index >= 0; index--) {
    if (array.length - 1 === index) {
      // Último elemento → rest es null (fin de la lista)
      list = { value: array[index], rest: null }
    } else {
      // Cada elemento apunta al nodo construido anteriormente
      list = { value: array[index], rest: list }
    }
  }
  return list
}

// ── listToArrayPersonal (solución original de Yoandy) ────
/**
 * Convierte una lista enlazada en un array.
 * SOLUCIÓN ORIGINAL — bug corregido: arr ahora es local a la función.
 *
 * BUG ORIGINAL: arr estaba declarado fuera de la función en el scope externo.
 * Llamar a la función dos veces acumulaba resultados de ambas llamadas.
 *
 * FIX: arr se declara dentro y se pasa como argumento interno al helper walk().
 *
 * @param {Object} list cualquier lista enlazada.
 * @returns {Array} array con los valores de la lista.
 */
const listToArrayPersonal = (list) => {
  let arr = [] // ← LOCAL ahora, no comparte estado entre llamadas

  const walk = (node) => {
    for (const [key, value] of Object.entries(node)) {
      if (node[key] !== null) {
        if (key === "value") {
          arr.push(value)
        } else {
          walk(value) // recursión sobre el nodo rest
        }
      } else {
        break // rest === null → fin de la lista
      }
    }
  }

  walk(list)
  return arr
}

// ── listToArray (versión recursiva con spread — con pista) ─
/**
 * Convierte una lista enlazada en un array usando recursión y spread.
 * @param {Object} list cualquier lista enlazada.
 * @returns {Array} array con los valores de la lista.
 */
const listToArray = (list) => {
  if (!list) return []
  return [list.value, ...listToArray(list.rest)]
}

// ── listToArrayTwo (versión iterativa — con pista) ────────
/**
 * Convierte una lista enlazada en un array usando un bucle iterativo.
 * La forma más eficiente: sin recursión, sin spread, O(n) puro.
 * @param {Object} list cualquier lista enlazada.
 * @returns {Array} array con los valores de la lista.
 */
const listToArrayTwo = (list) => {
  let arr = []
  for (let node = list; node; node = node.rest) {
    arr.push(node.value)
  }
  return arr
}

// ── prepend ───────────────────────────────────────────────
/**
 * Crea una nueva lista que añade el elemento al principio de la lista dada.
 *
 * BUG ORIGINAL: condición era (value !== null || value !== undefined).
 * Con || es SIEMPRE true — incluso cuando value es null:
 *   null !== null → false, null !== undefined → true → OR = true → pasa!
 *
 * FIX: usar && — AMBAS condiciones deben cumplirse.
 * Alternativa más limpia: value == null cubre null Y undefined a la vez.
 *
 * @param {*} value cualquier valor (no null, no undefined).
 * @param {Object} list lista enlazada existente.
 * @returns {Object} nueva lista con value como primer nodo.
 */
const prepend = (value, list) => {
  if (value == null) {
    // == null captura tanto null como undefined (double equals, no triple)
    return "Error: value cannot be null or undefined."
  }
  return { value, rest: list }
}

// ── nth (recursiva) ───────────────────────────────────────
/**
 * Devuelve el elemento en la posición dada de la lista (base 0).
 * Devuelve undefined si la posición no existe.
 * @param {Object} list lista enlazada.
 * @param {Number} position índice del elemento buscado (base 0).
 * @returns {*} valor en la posición dada, o undefined.
 */
const nth = (list, position) => {
  if (!list) return undefined // lista vacía o posición fuera de rango
  if (position === 0) return list.value // base case: posición encontrada
  return nth(list.rest, position - 1) // recursión: avanzar un nodo
}

// Tests
const myArr = [98, 23, 58, 1, 4, 77]
const myList = arrayToList(myArr)
console.log("arrayToList([98,23,58,1,4,77]):", myList)

// Comparar las tres versiones de listToArray
console.log("listToArrayPersonal:", listToArrayPersonal(myList)) // [98,23,58,1,4,77]
console.log("listToArray (spread):", listToArray(myList)) // [98,23,58,1,4,77]
console.log("listToArrayTwo (iter):", listToArrayTwo(myList)) // [98,23,58,1,4,77]

// Verificar que listToArrayPersonal no acumula entre llamadas
const list2 = arrayToList([10, 20, 30])
console.log("second call listToArrayPersonal:", listToArrayPersonal(list2)) // [10,20,30] ✓

// prepend
const baseList = arrayToList([2, 3])
console.log("prepend(1, [2,3] list):", prepend(1, baseList))
console.log("prepend(null, list):", prepend(null, baseList)) // Error ✓
console.log("prepend(undefined, list):", prepend(undefined, baseList)) // Error ✓

// nth
const exampleList = arrayToList([11, 22, 98, 23, 77, 33])
console.log("nth(list, 0):", nth(exampleList, 0)) // 11
console.log("nth(list, 2):", nth(exampleList, 2)) // 98
console.log("nth(list, 5):", nth(exampleList, 5)) // 33
console.log("nth(list, 10):", nth(exampleList, 10)) // undefined

// ─────────────────────────────────────────
// CHALLENGE 4 — deepEqual
// ─────────────────────────────────────────
console.log("\n=== Challenge 4 ===")

/**
 * Compara profundamente dos valores. Devuelve true si:
 * - Son el mismo valor primitivo, o
 * - Son objetos con las mismas propiedades y los mismos valores (recursivamente).
 *
 * BUG ORIGINAL: solo se iteraban Object.keys(valueOne).
 * Si valueTwo tenía claves extra, eran ignoradas silenciosamente.
 * deepEqual({a:1}, {a:1, b:2}) devolvía true — incorrecto.
 *
 * FIX: verificar que ambos objetos tengan el mismo número de claves
 * antes de iterar.
 *
 * @param {*} valueOne cualquier valor u objeto.
 * @param {*} valueTwo cualquier valor u objeto.
 * @returns {Boolean} true si son profundamente iguales, false si no.
 */
const deepEqual = (valueOne, valueTwo) => {
  // 1. Tipos distintos → no son iguales
  if (typeof valueOne !== typeof valueTwo) return false

  // 2. Ambos null → iguales
  //    (typeof null === "object", así que hay que comprobarlo antes del check de objeto)
  if (valueOne === null && valueTwo === null) return true

  // 3. Uno es null y el otro no (tipos son iguales "object", pero uno es null)
  if (valueOne === null || valueTwo === null) return false

  // 4. Comparación de objetos (arrays también son "object")
  if (typeof valueOne === "object") {
    const keysOne = Object.keys(valueOne)
    const keysTwo = Object.keys(valueTwo)

    // ← FIX: si tienen distinto número de claves, no son iguales
    if (keysOne.length !== keysTwo.length) return false

    // Comparar recursivamente cada propiedad
    for (const key of keysOne) {
      if (!deepEqual(valueOne[key], valueTwo[key])) return false
    }
    return true
  }

  // 5. Primitivos (string, number, boolean, etc.)
  return valueOne === valueTwo
}

// Tests — primitivos
console.log("deepEqual(1, 1):", deepEqual(1, 1)) // true
console.log("deepEqual(1, 2):", deepEqual(1, 2)) // false
console.log("deepEqual('a','a'):", deepEqual("a", "a")) // true
console.log("deepEqual(1, '1'):", deepEqual(1, "1")) // false — tipos distintos

// Tests — null
console.log("deepEqual(null, null):", deepEqual(null, null)) // true
console.log("deepEqual(null, {}):", deepEqual(null, {})) // false
console.log("deepEqual({}, null):", deepEqual({}, null)) // false

// Tests — objetos planos
console.log("deepEqual({a:1},{a:1}):", deepEqual({ a: 1 }, { a: 1 })) // true
console.log("deepEqual({a:1},{a:2}):", deepEqual({ a: 1 }, { a: 2 })) // false
console.log("deepEqual({a:1},{a:1,b:2}):", deepEqual({ a: 1 }, { a: 1, b: 2 })) // false ✓ (fixed!)

// Tests — objetos anidados (listas enlazadas)
const listA = arrayToList([1, 2, 3])
const listB = arrayToList([1, 2, 3])
const listC = arrayToList([1, 2, 99])
console.log("deepEqual(list[1,2,3], list[1,2,3]):", deepEqual(listA, listB)) // true
console.log("deepEqual(list[1,2,3], list[1,2,99]):", deepEqual(listA, listC)) // false
console.log("deepEqual(list[1,2,3], null):", deepEqual(listA, null)) // false
console.log(
  "deepEqual({val:1,rest:{val:2}}, {val:1,rest:{}}):",
  deepEqual({ value: 1, rest: { value: 2, rest: null } }, { value: 1, rest: {} }),
) // false
