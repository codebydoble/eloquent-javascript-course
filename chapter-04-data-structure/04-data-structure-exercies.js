/**
 * Chapter 4 Data Structure
 * Author: Yoandy Doble Herrera
 * Date: 17/04/2026
 */
"use strict"
console.log("\n=== Challenge 1 ===")

/**
 * Función range que tome dos argumentos, inicio y fin, y devuelva un array que contenga todos los números desde inicio hasta fin, incluyendo fin.
 * @param {Number} init any number smaller than end if positive.
 * @param {Number} end any number.
 * @param {Number} paso any number, step phase.
 * @returns {Array} Un array que contenga todos los números desde inicio hasta fin, incluyendo fin.
 */
const range = function (init, end, paso = 1) {
  let result = []
  if (init > end && paso < 0) {
    for (let index = init; index >= end; index += paso) {
      result.push(index)
    }
  } else {
    for (let index = init; index <= end; index += paso) {
      result.push(index)
    }
  }
  return result
}
let arrNumbers = range(5, 2, -1)
console.log(">>>Range", arrNumbers)

/**
 * Una función sum que tome un array de números y devuelva la
suma de estos números. 
 * @param {Array} array any number array.
 * @returns {Number} la suma de todos los números. 
 */
const sum = function (array) {
  let result = 0
  for (const nums of array) {
    result += nums
  }
  return result
}
console.log(">>>Sum", sum(arrNumbers))

console.log("\n=== Challenge 2 ===")

/**
 * Funcion que toma un array como argumento y producir un nuevo array que tenga los mismos elementos en orden inverso.
 * @param {Array} array cualquier array.
 * @returns {Array} un nuevo array que tenga los mismos elementos en orden inverso.
 */
const reverseArray = function (array) {
  let result = []
  for (let index = array.length - 1; index >= 0; index--) {
    result.push(array[index])
  }
  return result
}

let arrayReversed = reverseArray(arrNumbers)

console.log(">>>reverseArray", arrayReversed)

/**
 * Funcion método reverse modificar el array dado como argumento invirtiendo sus elementos.
 * @param {Array} array cualquier array.
 * @returns {Array} el mismo array con los elementos invertidos.
 */
const reverseArrayInPlace = function (array) {
  let result = []
  for (let index = array.length - 1; index >= 0; index--) {
    result.push(array[index])
  }
  return (array = result)
}

let numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

console.log(">>>reverse Array In Place", reverseArrayInPlace(numArr))

console.log("\n=== Challenge 3 ===")
/**
 * Función que produce un array a partir de una lista.
 * @param {Object} list cualquier lista anidada.
 * @returns {Array} un array a partir de un objeto anidado.
 */
let arr = []
const listToArrayPersonal = (list) => {
  for (const [key, value] of Object.entries(list)) {
    if (list[key] !== null) {
      if (key === "value") {
        arr.push(value)
      } else {
        listToArrayPersonal(value)
      }
    } else {
      break
    }
  }
  return arr
}

/**
 * Función que construye una estructura de lista a partir de un Array como argumento.
 * let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null,
    },
  },
}
 * @param {Array} array cualquier array.
 * @returns {Object} devuelve una lista de objetos anidados.
 */
const arrayToList = function (array) {
  let list = {}
  for (let index = array.length - 1; index >= 0; index--) {
    if (array.length - 1 === index) {
      // Last element
      list = {
        value: array[index],
        rest: null,
      }
    } else {
      list = {
        value: array[index],
        rest: list,
      }
    }
  }
  return list
}

let listArr = [1, 2, 3]
let myArr = [98, 23, 58, 1, 4, 77]
let listNumber = arrayToList(myArr)
console.log(">>>List Number", listNumber)

/**
 * Función que produce un array a partir de una lista.
 * @param {Object} list cualquier lista anidada.
 * @returns {Array} un array a partir de un objeto anidado.
 */
const listToArray = (list) => {
  if (!list) return []
  if (list.rest) {
    return [list.value, ...listToArray(list.rest)]
  }
  return [list.value]
}

// --- Ejemplo de uso ---
let listNumberExample = {
  value: 10,
  rest: {
    value: 20,
    rest: {
      value: 30,
      rest: null,
    },
  },
}
console.log(">>>List", listNumberExample)
const arrayPure = listToArray(listNumberExample)
console.log(">>>Array Pure", arrayPure) // [10, 20, 30]

/**
 * Función que produce un array a partir de una lista.
 * @param {Object} list cualquier lista anidada.
 * @returns {Array} un array a partir de un objeto anidado.
 */
const listToArrayTwo = (list) => {
  let arr = []
  for (let node = list; node; node = node.rest) {
    arr.push(node.value)
  }
  return arr
}
console.log(">>>Lista", listNumber)
let listaArray = listToArrayTwo(listNumber)
console.log(listaArray)

/**
 * Función que toma un elemento y una lista y crea una
nueva lista que añade el elemento al principio de la lista de entrada.
 * @param {String | Number | Array | Object} value cualquier elemento except null or undefined.
 * @param {Object} list cualquier lista anidada.
 * @returns nueva lista anidada con value como primer elemento.
 */
const prepend = (value, list) => {
  if (value !== null || value !== undefined) {
    return {
      value: value,
      rest: list,
    }
  } else {
    return "Error: value null or undefined."
  }
}

let prepended = prepend(2, listNumberExample)
console.log(">>>Lista con nuevo valor convertida en array", prepended)

/**
 * 
Si aún no lo has hecho, escribe también una versión recursiva de nth.
 */

/**
 * Funcion que toma una lista y un número y devuelve el elemento en la posición dada en la lista (siendo cero el primer elemento) o undefined cuando no hay tal elemento.
 * @param {Object} list Cualquier lista anidada.
 * @param {Number} position Posicion del elemento a devolver.
 * @returns {Number|undefined} Devuelve el elemento en la posición dada en la lista o undefined cuando no hay tal elemento.
 */
const nth = (list, position) => {
  // 1. Check empty list
  if (!list) return undefined
  if (position === 0) return list.value
  if (position > 0) {
    return nth(list.rest, position - 1)
  }
}

// --- Ejemplo de uso ---
let exampleList = {
  value: 11,
  rest: {
    value: 22,
    rest: {
      value: 98,
      rest: {
        value: 23,
        rest: {
          value: 77,
          rest: {
            value: 33,
            rest: null,
          },
        },
      },
    },
  },
}
const elementList = nth(exampleList, 2)
console.log(elementList)

console.log("\n=== Challenge 4 ===")

/**
 * Función deepEqual que toma dos valores y devuelve true solo si
son el mismo valor o son objetos con las mismas propiedades, donde los valores
de las propiedades son iguales cuando se comparan con una llamada recursiva
a deepEqual.
 * @param {*} valueOne cualquier valor u objeto.
 * @param {*} valueTwo cualquier valor u objeto.
 * @returns {Boolean} Devuelve true solo si
son el mismo valor o son objetos con las mismas propiedades, sino false.
 */
const deepEqual = (valueOne, valueTwo) => {
  let decision = true
  // Typeof
  let typeOne = typeof valueOne
  let typeTwo = typeof valueTwo
  // 1. check differents types
  if (typeOne !== typeTwo) {
    return false
  } else if (valueOne === null && valueTwo === null) {
    // 2. checks null because typeof null = object
    return true
  } else if (typeOne === "object" && typeTwo === "object" && valueOne !== null && valueTwo !== null) {
    // 3. obj check
    for (const key of Object.keys(valueOne)) {
      decision = deepEqual(valueOne[key], valueTwo[key])
      if (decision === true) {
        continue
      } else {
        return false
      }
    }
    return decision
  } else {
    // 4. entity check
    return valueOne === valueTwo
  }
}

console.log(
  deepEqual(
    {
      value: 1,
      rest: {
        value: 2,
        rest: {
          value: 3,
          rest: null,
        },
      },
    },
    null,
  ),
)
console.log(
  deepEqual(
    {
      value: 1,
      rest: {
        value: 2,
        rest: {
          value: 3,
          rest: null,
        },
      },
    },
    {
      value: 1,
      rest: {
        value: 2,
        rest: {},
      },
    },
  ),
)
