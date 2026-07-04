/**
 * Chapter 8 Bugs and errors
 * Author: Yoandy Doble Herrera
 * Date: 22/06/2026
 */
"use strict"

class MultiplicatorUnitFailure extends Error {}

/**
 * Function that multiply two numbers.
 * @param {Number} numOne Any number.
 * @param {Number} numTwo Any number.
 * @returns {Number} multiply result.
 */
const primitiveMultiply = () => {
  const numOne = prompt("Insert first number to multiply")
  const numTwo = prompt("Insert second number to multiply")
  const numOneParsed = parseFloat(numOne)
  const numTwoParsed = parseFloat(numTwo)
  if (isNaN(numOneParsed)) throw new MultiplicatorUnitFailure("Only numbers allowed. You insert: " + numOne)
  if (isNaN(numTwoParsed)) throw new MultiplicatorUnitFailure("Only numbers allowed. You insert: " + numTwo)
  if (numOneParsed === 0 || numTwoParsed === 0) throw new Error("Multiply by cero not allowed.")
  return numOneParsed * numTwoParsed
}

for (;;) {
  try {
    const multiply = primitiveMultiply()
    while (isNaN(multiply)) {
      multiply = primitiveMultiply()
    }
    console.log(">>> Result " + multiply)
    break
  } catch (error) {
    if (error instanceof MultiplicatorUnitFailure) {
      console.log(`Multiplicator Unit Failure ${error.message}`)
    } else {
      console.log(`Error ${error.message}`)
    }
  }
}

const box = new (class {
  locked = true
  #content = [22, 22]
  /**
   * Function that unlock content array.
   */
  unlock() {
    this.locked = false
  }
  /**
   * Function that lock content array.
   */
  lock() {
    this.locked = true
  }
  /**
   *
   * @param {Function} fnc any function.
   */
  withBoxUnlocked(fnc) {
    // 1. checks isLocked?
    if (this.locked) {
      // 2. unlock box
      this.unlock()
      // 3. exec fnc with try-catch-finally
      try {
        fnc(this.content)
      } catch (error) {
        console.log(error.message)
      } finally {
        // 4. lock box
        this.lock()
      }
    } else {
      // 3. exec fnc
      fnc(this.content)
      // 4. remain unlock
    }
  }
  /**
   * Returns box array only if unlocked.
   * @returns {Array} box array.
   */
  get content() {
    if (this.locked) throw new Error("¡Cerrado con llave!")
    return this.#content
  }
})()

/**
 * Function that sum all numbers.
 * @param {Number[]} arr any number array.
 * @returns {Number} sum of all numbers.
 */
const sumAll = (arr) => {
  if (arr.length === 0) throw new RangeError("Range error: ¡Empty array!")
  const result = arr.reduce((sum, num) => {
    if (isNaN(num)) {
      throw new Error("NaN: ¡Invalid argument!")
    } else if (typeof num !== "number") {
      throw new TypeError("Type error: isn't a number: " + num + " typeof -> " + typeof num)
    }
    return (sum += num)
  }, 0)
  console.log("Result", result)
}

console.log("isLocked -> ", box.locked) //true
box.unlock()
console.log("Now Unlocked -> ", box.locked) // false
box.withBoxUnlocked(sumAll)
console.log("Check must remain unlocked -> ", box.locked) // false
box.lock()
console.log("Now locked -> ", box.locked) //true
box.withBoxUnlocked(sumAll)
console.log("Check must locked again -> ", box.locked) // true
