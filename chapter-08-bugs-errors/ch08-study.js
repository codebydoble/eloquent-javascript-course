"use strict"
/*function canYouSpotTheProblem() {
  "use strict"
  for (let counter = 0; counter < 10; counter++) { // olvidó el let
    console.log("Happy happy")
  }
}
canYouSpotTheProblem()
*/
// → ReferenceError: counter is not defined

/*function Person(name) {
  this.name = name
}
let ferdinand = Person("Ferdinand") */ // olvidó el new
// → TypeError: Cannot set property 'name' of undefined

function test(label, body) {
  if (!body()) console.log(`Fallo: ${label}`)
}
test("convertir texto latino a mayúsculas", () => {
  return "hello".toUpperCase() == "HELLO"
})
test("convertir texto griego a mayúsculas", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ"
})
test("no convertir caracteres sin caso", () => {
  return "‫ڑغ׍‬৹৫".toUpperCase() == "‫ڑغ׍‬৹৫"
})

class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question)
  if (result.toLowerCase() == "izquierda") return "I"
  if (result.toLowerCase() == "derecha") return "D"
  throw new InputError("Error de input")
}

try {
  let dir = promptDirection("Hacia donde?")
  if (dir === "I") {
    console.log("Ves una casa")
  } else {
    console.log("Ves un oso")
  }
} catch (error) {
  if (error instanceof InputError) {
    console.log("Input error", error.message)
  } else {
    console.log("Error aleatorio")
  }
}

class NameError extends Error {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
  }
}
