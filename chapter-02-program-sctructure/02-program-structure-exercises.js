/**
 * Chapter 2 Program Structure
 * Author: Yoandy Doble Herrera
 * Date: 16/04/2026
 */
"use strict"
console.log("\n=== Challenge 1 ===")
/**
 * Escribe un bucle que realice siete llamadas a console.log para mostrar el
siguiente triángulo:
#
##
###
####
#####
######
#######
 */

for (let index = 0; index < 7; index++) {
  console.log("#".repeat(index + 1))
}

console.log("\n=== Challenge 2 ===")
/**
 * Escribe un programa que use console.log para imprimir todos los números
del 1 al 100, con dos excepciones. Para los números divisibles por 3, imprime
"Fizz" en lugar del número, y para los números divisibles por 5 (y no por 3),
imprime "Buzz" en su lugar.
Cuando tengas eso funcionando, modifica tu programa para imprimir "FizzBuzz
" para los números que son divisibles por 3 y 5 (y sigue imprimiendo "Fizz" o
"Buzz" para los números que son divisibles solo por uno de esos).
 */
let countEx2 = 1
while (countEx2 <= 100) {
  if (countEx2 % 5 === 0 && countEx2 % 3 !== 0) {
    console.log(">>>Buzz", "#:", countEx2)
  } else if (countEx2 % 3 === 0) {
    console.log(">>>Fizz", "#:", countEx2)
  } else {
    console.log("#:", countEx2)
  }
  countEx2++
}

console.log("\n=== Challenge 2 -Alternative-===")
let counterEx2 = 1
while (counterEx2 <= 100) {
  if (counterEx2 % 5 === 0 && counterEx2 % 3 === 0) {
    console.log(">>>FizzBuzz", "#:", counterEx2)
  } else if (counterEx2 % 5 === 0 && counterEx2 % 3 !== 0) {
    console.log(">>>Buzz", "#:", counterEx2)
  } else if (counterEx2 % 3 === 0) {
    console.log(">>>Fizz", "#:", counterEx2)
  } else {
    console.log("#:", counterEx2)
  }
  counterEx2++
}

console.log("\n=== Challenge 2 -Ellegant-===")
let increase = 1
while (increase <= 100) {
  let output = ``
  if (increase % 3 === 0) {
    output += "Fizz"
  }
  if (increase % 5 === 0) {
    output += "Buzz"
  }
  console.log(">>>Output", output || increase, "#:", increase)
  increase++
}

console.log("\n=== Challenge 3 ===")
/**
 * Escribe un programa que cree una cadena que represente un tablero de 8x8,
usando caracteres de salto de línea para separar las líneas. En cada posición
del tablero hay un carácter de espacio o un carácter "#". Los caracteres deben
formar un tablero de ajedrez.
Al pasar esta cadena a console.log debería mostrar algo como esto:
 # # # #
# # # #
 # # # #
# # # #
 # # # #
# # # #
 # # # #
# # # #
Cuando tengas un programa que genere este patrón, define una variable size
= 8 y cambia el programa para que funcione para cualquier size, generando
un tablero con el ancho y alto dados.
 */

let arrTemp = []
let size = 8 // Parte 2 utilizar size
for (let indexRow = 0; indexRow < size; indexRow++) {
  for (let indexColumn = 0; indexColumn < size; indexColumn++) {
    // par row start:_#
    if (indexRow % 2 === 0) {
      //check previous or empty to add _ blank space
      if (arrTemp.length === 0 || arrTemp[arrTemp.length - 1] !== " ") {
        arrTemp.push(" ")
      } else {
        arrTemp.push("#")
      }
    }
    //impar row start:#_
    else {
      if (arrTemp[arrTemp.length - 1] !== "#") {
        arrTemp.push("#")
      } else {
        arrTemp.push(" ")
      }
    }
  }
  // new carrier
  arrTemp.push("\n")
}
console.log(arrTemp.join(""))

/**
 * Function that creates a chess board from row and column size.
 * @param {Number} row chess board row size.
 * @param {Number} column chess board column size.
 * @returns {String} a chess board.
 */
const chessBoard = function (row, column) {
  let arrChess = []
  for (let indexRow = 0; indexRow < row; indexRow++) {
    // for to move into row
    for (let indexColumn = 0; indexColumn < column; indexColumn++) {
      // column for
      // par row start:_#
      if ((indexRow + indexColumn) % 2 === 0) {
        //check previous or empty to add _ blank space
        if (arrChess.length === 0) {
          // Empty array and par row
          arrChess.push(" ")
        } else if (arrChess[arrChess.length - 1] !== " " || arrChess[arrChess.length - 1] === "\n") {
          arrChess.push(" ")
        } else {
          arrChess.push("#")
        }
      }
      //impar row start:#_
      else {
        if (arrChess[arrChess.length - 1] !== "#" || arrChess[arrChess.length - 1] === "\n") {
          arrChess.push("#")
        } else {
          arrChess.push(" ")
        }
      }
    }
    // new carrier
    arrChess.push("\n")
  }
  return arrChess.join("")
}
console.log(chessBoard(4, 10))
