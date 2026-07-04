/**
 * Chapter 3 Functions
 * Author: Yoandy Doble Herrera
 * Date: 17/04/2026
 */
"use strict"
console.log("\n=== Challenge 1 ===")
/**
 * El capítulo previo presentó la función estándar Math.min que devuelve su menor argumento. Ahora podemos escribir una función como esa nosotros mismos.
Define la función min que toma dos argumentos y devuelve su mínimo.
 */

/**
 * Define la función min que toma dos argumentos y devuelve su mínimo.
 * @param {Number} numOne any number.
 * @param {Number} numTwo any number.
 * @returns the min number of two.
 */
const minimun = function (numOne, numTwo) {
  if (numTwo === undefined) {
    return numOne
  } else if (numOne === numTwo) {
    return numOne
  } else if (numOne < numTwo) {
    return numOne
  } else {
    return numTwo
  }
}
console.log(">>> Math.min -personal-:", minimun(20, -4))

console.log("\n=== Challenge 2 ===")
/**
 * Hemos visto que podemos usar % (el operador de resto) para verificar si un
número es par o impar al usar % 2 para ver si es divisible por dos. Aquí hay
otra forma de definir si un número entero positivo es par o impar:
• El cero es par.
• El uno es impar.
• Para cualquier otro número N, su paridad es la misma que N - 2.
Define una función recursiva isEven que corresponda a esta descripción. La
función debe aceptar un solo parámetro (un número entero positivo) y devolver
un booleano.
Pruébalo con 50 y 75. Observa cómo se comporta con -1. ¿Por qué? ¿Puedes
pensar en una forma de solucionarlo?
 */

/**
 * Función recursiva que comprueba si un número entero positivo es par o impar.
 * @param {Number} entero Un número entero positivo.
 * @returns {Boolean} Si el número es divisible por 2 es par sino es impar.
 */
const isEven = function (entero) {
  if (entero === 0) {
    return true
  } else if (entero === 1) {
    return false
  } else if (entero < 0) {
    return isEven(entero + 2)
  } else {
    return isEven(entero - 2)
  }
}
console.log(">>>isEven", isEven(-1))
console.log("\n=== Challenge 3 ===")
/**
 * Puedes obtener el *ésimo carácter, o letra, de una cadena escribiendo [N] de-
spués de la cadena (por ejemplo, cadena[2]). El valor resultante será una
cadena que contiene solo un carácter (por ejemplo, "b"). El primer carácter
tiene la posición 0, lo que hace que el último se encuentre en la posición cadena
.length - 1. En otras palabras, una cadena de dos caracteres tiene longitud
2, y sus caracteres tienen posiciones 0 y 1.
Escribe una función contarBs que tome una cadena como único argumento
y devuelva un número que indique cuántos caracteres B en mayúscula hay en
la cadena.
A continuación, escribe una función llamada contarCaracter que se com-
porte como contarBs, excepto que toma un segundo argumento que indica el
carácter que se va a contar (en lugar de contar solo caracteres B en mayúscula).
Reescribe contarBs para hacer uso de esta nueva función.
*/
let iaText =
  "Las IA, o inteligencias artificiales, son sistemas informáticos diseñados para realizar tareas que normalmente requieren inteligencia humana, como el aprendizaje, la percepción, el razonamiento y la toma de decisiones. Estos sistemas utilizan algoritmos y datos para simular capacidades humanas y mejorar la eficiencia en diversas áreas, como la medicina, la manufactura, el comercio y más. Escribe una función contarBs que tome una cadena como único argumento y devuelva un número que indique cuántos caracteres B en mayúscula hay en la cadena."
/**
 * Una función que tome una cadena como único argumento y devuelva un número que indique cuántos caracteres insertado en -char- hay en la cadena.
 * @param {String} sentence Cualquier cadena de caracteres.
 * @param {String} char El carácter que se va a contar.
 * @returns {Number} Devuelve un número que indique cuántos caracteres B en mayúscula hay en la cadena.
 */
console.log("\n=== Challenge 3 -Part 2-===")
const contarCaracter = function (sentence, char) {
  let result = 0
  for (let index = 0; index < sentence.length; index++) {
    if (sentence[index] === char) {
      result++
    }
  }
  return result
}
let myChar = "a"
console.log(">>> contarBs:", contarCaracter(iaText, myChar))

/**
 * Una función que tome una cadena como único argumento y devuelva un número que indique cuántos caracteres B en mayúscula hay en la cadena.
 * @param {Function} fnc Function contarCaracter.
 * @param {String} sentence Cualquier cadena de caracteres.
 * @param {String} char El carácter que se va a contar.
 * @returns {Number} Devuelve un número que indique cuántos caracteres B en mayúscula hay en la cadena.
 */
const contarBs = function (sentence) {
  return contarCaracter(sentence, "B")
}

console.log(">>> contarBs:", contarBs(iaText))
