/**
 * Chapter 11 Asynchronous Programming
 * Author: Yoandy Doble Herrera
 * Date: 20/08/2026
 */
"use strict"

console.log(`\n # Exercise 1 — Async File Activity Table  \n`)

const logData = [
  1727265600000, 1727272800000, 1727294400000, 1727283600000, 1727098800000, 1727102400000, 1727113200000, 1727120400000,
]

/**
 * Function that reads a file log data. Returns a Promise.
 * @returns {Promise} returns log data.
 */
function textFile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(logData.join("\\n")), 50)
  })
}

/**
 * Function that creates an object map {0:0, 1:0 .......... }
 * @returns {Object} an object map {0:0, 1:0 .......... }
 */
const arrMap = () => {
  let map = Object.create(null)
  for (let index = 0; index < 24; index++) {
    map[index] = 0
  }
  return map
}

/**
 * Create an asynchronous function that receives a day of the week and returns an array of **24 hourly activity counts** based on timestamp data.
 * @param {Number} day a day of the week
 * @returns {Number[]} an array of **24 hourly activity counts** based on timestamp data.
 */
const activityTable = async (day) => {
  try {
    if (typeof day !== "number") {
      throw new TypeError(`Type error: invalid value for parameter day ${day}`)
      return
    }
    if (day < 0 || day > 6 || Number.isNaN(day)) {
      throw new RangeError(`Range error: negative, bigger than 6 or not a number: ${day}`)
      return
    }
    const files = await textFile()
    if (String(files).trim() === "") {
      throw new Error("Error: Empty file.")
      return
    }
    const fileNames = String(files).trim().split("\\n")
    const timestamps = fileNames.map((timestamp) => new Date(Number(timestamp))).filter((date) => date.getDay() === day)
    if (timestamps.length === 0) {
      throw new RangeError(`Range error: No timestamps match the requested day ${day}.`)
    }
    const hours = timestamps.reduce((acc, date, i) => {
      let hour = date.getHours()
      acc[hour] = acc[hour] + 1
      return acc
    }, arrMap())
    return Object.values(hours)
  } catch (error) {
    console.log(error.message)
    return new Array(24).fill(0)
  }
}

const result = await activityTable(1)
console.log(">>>Case 1 -> ", Array.isArray(result)) // true
console.log(">>>Case 2 -> ", result.length) // 24
const noMatch = await activityTable(10)
console.log(">>>Case 3 -> ", noMatch) // 24 zeroes
console.log(">>>Case 4 -> ", result.some(Number.isNaN)) // false
console.log(">>>Case 5 -> ", await activityTable(7)) // 24 zeros
console.log(">>>Case 6 -> ", result) // Number[]

console.log(`\n # Exercise 2 — Same Problem with a Promise Chain  \n`)

/**
 * Create an asynchronous function that receives a day of the week and returns an array of **24 hourly activity counts** based on timestamp data.
 * Implement the same activity-table problem from Exercise 1, but using *Promises and `.then()`** instead of `async/await`.
 * @param {Number} day a day of the week
 * @returns {Promise} an array of **24 hourly activity counts** based on timestamp data.
 */
function activityTablePromise(day) {
  return new Promise((resolve, reject) => {
    if (typeof day !== "number") {
      reject(new TypeError(`Type error: invalid value for parameter day ${day}`))
    }
    if (day < 0 || day > 6 || Number.isNaN(day)) {
      reject(new RangeError(`Range error: negative, bigger than 6 or not a number: ${day}`))
    }
    const files = textFile()
      .then((logData) => {
        if (String(logData).trim() === "") {
          reject(new Error("Empty file."))
        }
        return logData
      })
      .catch((reason) => {
        reject(reason)
      })
    return files
      .then((logData) => {
        const fileNames = String(logData).trim().split("\\n")
        const timestamps = fileNames.map((timestamp) => new Date(Number(timestamp))).filter((date) => date.getDay() === day)
        if (timestamps.length === 0) {
          reject(new RangeError(`Range error: No timestamps match the requested day ${day}.`))
        }
        const hours = timestamps.reduce((acc, date, i) => {
          let hour = date.getHours()
          acc[hour] = acc[hour] + 1
          return acc
        }, arrMap())
        resolve(Object.values(hours))
      })
      .catch((reason) => {
        reject(reason)
        return new Array(24).fill(0)
      })
  })
}

const resultEx2 = await activityTablePromise(1)
  .then((response) => {
    return response
  })
  .catch((reason) => {
    console.log(reason.message)
    return new Array(24).fill(0)
  })

Array.isArray(resultEx2) === true
resultEx2.length === 24
console.log(">>>Case 1 -> ", Array.isArray(resultEx2)) // true
console.log(">>>Case 2 -> ", resultEx2.length) // 24
const noMatchEx2 = await activityTablePromise(10)
  .then((response) => {
    return response
  })
  .catch((reason) => {
    console.log(reason.message)
    return new Array(24).fill(0)
  })
console.log(">>>Case 3 -> ", noMatchEx2) // 24 zeroes
console.log(">>>Case 4 -> ", resultEx2.some(Number.isNaN)) // false
console.log(
  ">>>Case 5 -> ",
  await activityTablePromise(7)
    .then((response) => {
      return response
    })
    .catch((reason) => {
      console.log(reason.message)
      return new Array(24).fill(0)
    }),
) // 24 zeros
console.log(">>>Case 6 -> ", resultEx2) // Number[]

console.log(`\n # Exercise 3 — Sequential vs Concurrent File Reads  \n`)

/**
 * /**
 * Function that reads a file log data and return toUpperCase. Returns a Promise.
 * @param {String} filename any file name. Harcoded with this object {
  "a.txt": 100,
  "b.txt": 200,
  "c.txt": 150,}
 * @returns {Promise} returns log data.
 */
function textFileEx3(filename) {
  const delays = {
    "a.txt": 100,
    "b.txt": 200,
    "c.txt": 150,
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filename.toUpperCase())
    }, delays[filename])
  })
}

/**
 * Given multiple asynchronous file reads all files. A sequential version.
 * @param {String[]} files any array of files.
 * @returns {Array} Return an array of results.
 */
async function readSequential(files) {
  try {
    if (files.length === 0) {
      throw new RangeError("Empty input file.")
    }
    if (!Array.isArray(files)) {
      throw new SyntaxError(`Syntax error: input files ${files} isn't an array.`)
    }
    let result = []
    for (const file of files) {
      const value = await textFileEx3(file)
      result.push(value)
    }
    return result
  } catch (error) {
    error instanceof Error ? console.log(`Error: ${error.message}`) : console.log(error.message)
    return []
  }
}

/**
 * Given multiple asynchronous file reads all files. A concurrent version.
 * @param {String[]} files any array of files.
 * @returns {Array} Return an array of results.
 */
async function readConcurrent(files) {
  try {
    if (files.length === 0) {
      throw new RangeError("Empty input file.")
    }
    if (!Array.isArray(files)) {
      throw new SyntaxError(`Syntax error: input files ${files} isn't an array.`)
    }
    return await Promise.all([...files].map((file) => textFileEx3(file)))
  } catch (error) {
    error instanceof Error ? console.log(`Error: ${error.message}`) : console.log(error.message)
    return []
  }
}

const sequential = await readSequential(["a.txt", "b.txt", "c.txt"])
console.log(">>>Case sequential 1: ", sequential) // [ 'A.TXT', 'B.TXT', 'C.TXT' ]

const sequential1 = await readSequential([])
console.log(">>>Case sequential2: ", sequential1) // []

const concurrent = await readConcurrent(["a.txt", "b.txt", "c.txt"])
console.log(">>>Case concurrent 3: ", concurrent) // [ 'A.TXT', 'B.TXT', 'C.TXT' ]

const concurrent1 = await readConcurrent([])
console.log(">>>Case concurrent 4: ", concurrent1) // []

console.log(`\n # Exercise 4 — Promise Order vs Resolution Order \n`)

/**
 * Create a function that runs asynchronous operations concurrently while preserving the **original input order** in the returned result.
 * @param {Promise[]} promises the **original input order** in the returned result.
 */
const collectInOrder = async (promises) => {
  try {
    if (promises.length === 0) {
      throw new RangeError("Empty input file.")
    }
    if (!Array.isArray(promises)) {
      throw new SyntaxError(`Syntax error: input files ${promises} isn't an array.`)
    }
    return await Promise.all([...promises])
  } catch (error) {
    console.log(error.message)
    return []
  }
}

const promises = [
  new Promise((resolve) => setTimeout(() => resolve(1), 300)),
  new Promise((resolve) => setTimeout(() => resolve(2), 100)),
  new Promise((resolve) => setTimeout(() => resolve(3), 200)),
]

/**
 * Function that resolves a Promise using delay time.
 * @param {String|Number|Boolean|Array|Object|Map|Set} input any input data.
 * @param {Number} delay wait time.
 * @returns {Promise} return result promise after delay.
 */
const delayResolve = (input, delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(input), delay))
}

console.log(">>>EX4 case 1 ->   ", await collectInOrder(promises)) // [ 1, 2, 3 ]
console.log(">>EX4 case 2 ->   ", await collectInOrder([delayResolve("A", 300), delayResolve("B", 10), delayResolve("C", 150)])) // ["A", "B", "C"]
console.log(
  ">>>EX4 case 3 ->   ",
  await collectInOrder([delayResolve("first", 1), delayResolve("second", 300), delayResolve("third", 1)]),
) // ["first", "second", "third"]

console.log(`\n # Exercise 5 — Implement Promise_all \n`)

/**
 * Implement a simplified version of native `Promise.all()`.
 * @param {Promise[]} promises any Promise array. Inside array the data type could be Promise|Function that return Promise|String|Number|Boolean|Array|Object|Map|Set
 * @returns {Promise[]} return Promise array resolve when every input item resolves, reject when any input rejects.
 */
async function Promise_all(promises) {
  try {
    if (promises.length === 0) {
      throw new RangeError("Empty input file.")
    }
    if (!Array.isArray(promises)) {
      throw new SyntaxError(`Syntax error: input files ${promises} isn't an array.`)
    }
    let promiseAll = new Array(promises.length)
    for (let index = 0; index < promises.length; index++) {
      if (promises[index] === null) {
        throw new TypeError(`Error: null value.`)
      }
      if (typeof promises[index] === "undefined") {
        throw new TypeError(`Error: undefined value.`)
      }
      if (typeof promises[index] === "number" && Number.isNaN(promises[index])) {
        throw new Error(`Error value ${promises[index]}: isn't a number.`)
      }
      if (typeof promises[index] === "number" && !Number.isNaN(promises[index])) {
        promiseAll[index] = promises[index]
      }
      if (typeof promises[index] === "object" && !(promises[index] instanceof Promise) && !Array.isArray(promises[index])) {
        promiseAll[index] = promises[index]
      }
      if (typeof promises[index] === "string" || typeof promises[index] === "boolean" || Array.isArray(promises[index])) {
        promiseAll[index] = promises[index]
      }
      // Promise
      const resolved = await promises[index]
      promiseAll[index] = resolved
    }
    return promiseAll
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log(error)
    }
    return []
  }
}

console.log(">>>EX5 case 1 ->   ", await Promise_all([Promise.resolve("A"), Promise.resolve("B"), Promise.resolve("C")])) // ["A", "B", "C"]
console.log(">>>EX5 case 2 ->   ", await Promise_all([])) // []
console.log(">>>EX5 case 3 ->   ", await await Promise_all([delayResolve(1, 300), delayResolve(2, 100), delayResolve(3, 200)])) // [1, 2, 3]
console.log(">>>EX5 case 4 ->   ", await Promise_all([1, Promise.resolve(2), 3])) // [1, 2, 3]
console.log(
  ">>>EX5 case 7 ->   ",
  await Promise_all([delayResolve("slow", 300), delayResolve("fast", 50), delayResolve("middle", 150)]),
) // ["slow", "fast", "middle"]
console.log(">>>EX5 case 5 ->   ", await Promise_all([Promise.resolve("A"), Promise.reject("X"), Promise.resolve("C")])) // "Rejected X"

console.log(`\n # Exercise 6 — Async Error Propagation \n`)
const users = {
  1: { id: 1, name: "Ada" },
  2: { id: 2, name: "Linus" },
}

const orders = {
  1: ["order-101", "order-102"],
  2: [],
}

/**
 * Function that return a Promise with user object if not found: "User not found"
 * @param {Number} id any id number.
 * @returns {Promise} resolve id object otherwise "User not found"
 */
function loadUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof id !== "number" || Number.isNaN(id)) {
        reject(new TypeError(`Type error id ${id}: invalid value.`))
      }
      id in users ? resolve(users[id]) : reject("User not found")
    }, 50)
  })
}

/**
 * Function that return a Promise with orders array user object.
 * @param {Number} userId any user id to get orders array
 * @returns {Promise} resolves with that user's orders - rejects if the user has no order record.
 */
function loadOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      userId in orders && orders[userId].length > 0 ? resolve(orders[userId]) : reject([])
    }, 50)
  })
}

/**
 * An asynchronous pipeline where an error can originate in one operation and must reach the caller correctly.
 * @param {Number} id any user id
 *
 */
async function getUserOrders(id) {
  try {
    if (typeof id !== "number" || Number.isNaN(id)) {
      throw new TypeError(`Type error id ${id}: invalid value.`)
    }
    const user = await loadUser(id)
    const orders = await loadOrders(user.id)
    return { user, orders }
  } catch (error) {
    if (Array.isArray(error) && error.length === 0) {
      return { user: await loadUser(id), orders: [] }
    }
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>>EX6 case 1 ->   ", await getUserOrders(1)) // { user: { id: 1, name: 'Ada' }, orders: [ 'order-101', 'order-102' ] }
console.log(">>>EX6 case 2 ->   ", await getUserOrders(99)) // User not found
console.log(">>>EX6 case 3 ->   ", await getUserOrders(2)) //

/**
 * # Exercise 7 — Event Loop Prediction
start - executes first because is in call stack. 
end - executes second because is in call stack.
promise-1 - executes third all microtask this is one.
microtask-inside-promise - executes fourth because is inside a microtask and executes a call stask console.log
timeout-1 - executes fifth it's a macrotask pick one
timeout-2 - executes six it's a macrotask.

Event Loop
call stack -> browser/node api -> microtask *drain all* -> pick one macrotask * loop again *
*/

console.log(`\n # Exercise 8 — Fix the Empty-Input / Base-Case Bug \n`)

/**
 * Fix the function without changing its external signature.
 * - Always return an array.
- Always return exactly 24 values.
- Empty `filtered` input must still produce 24 zeroes.
- Do not return the accumulator object.
- Use `Object.values()` only after accumulation is complete.
- Preserve `getHours()`.
 * @param {String[]} timestamps array of times.
 * @param {Number} day any day 0 - Sunday to 7 - Saturday.
 * @returns {Number[]} hourly count for timestamp.
 */
function countHours(timestamps, day) {
  const filtered = timestamps.map((ts) => new Date(ts)).filter((date) => date.getDay() === day)
  if (filtered.length === 0) {
    return Object.values(arrMap())
  }
  const hours = filtered.reduce((acc, date) => {
    acc[date.getHours()]++
    return acc
  }, arrMap())
  return Object.values(hours)
}

const resultEx8 = countHours([], 1)
console.log("Ex 8 Case 1 -> ", Array.isArray(resultEx8) === true)
console.log("Ex 8 Case 2 ->", resultEx8.length === 24)
console.log("Ex 8 Case 3 ->", resultEx8)
console.log("Ex 8 Case 4 ->", resultEx8.some(Number.isNaN))

console.log(`\n # Exercise 9 — Retry with an Explicit Base Case \n`)

/**
 * Function that implement a retry mechanism for an asynchronous operation.
 * @param {Promise} operation function returning a Promise.
 * @param {Number} attempts maximum number of executions.
 * @returns {Promise} a promise with resolve / reject message. 
 * ## Requirements
- Return a Promise.
- Execute `operation` at most `attempts` times.
- If the operation succeeds, resolve immediately.
- If it fails and attempts remain, retry.
- If it fails and no attempts remain, reject with the final error.
- `attempts === 1` means exactly one possible execution.
- `attempts === 0` must not execute `operation`.
- `attempts < 0` must be rejected as invalid input.
- Do not retry after success.
- Do not swallow the final error.

 */
function retry(operation, attempts) {
  return new Promise((resolve, reject) => {
    // `attempts === 0` must not execute `operation`.
    if (attempts === 0) {
      return
    }
    // `attempts < 0` must be rejected as invalid input.
    if (attempts < 0) {
      return reject(new RangeError("invalid input"))
    }
    // `attempts === 1` means exactly one possible execution. Use normal flow.
    for (let attemp = 0; attemp < attempts; attemp++) {
      Promise.resolve(operation())
        .then((response) => {
          resolve(response)
        })
        .catch((reason) => {
          if (attemp + 1 === attempts) {
            if (reason instanceof Error) {
              reject(reason.message)
            } else {
              reject(reason)
            }
          }
        })
    }
  })
}

const success = () => Promise.resolve("OK")

const failure = () => Promise.reject(new Error("FAILED"))

let calls = 0
const flaky = () => {
  calls++

  if (calls < 3) {
    return Promise.reject(new Error("Temporary failure"))
  }

  return Promise.resolve("OK")
}

console.log("Ex 9 Case 1 ### Always successful ->", await retry(success, 3))
console.log(
  "Ex 9 Case 2 ### Failure ->",
  await retry(failure, 3)
    .then((response) => response)
    .catch((reason) => reason),
)
console.log("Ex 9 Case 3 ### Flaky operation ->", await retry(flaky, 3))

console.log(`\n # Exercise 10 \n`)

/**
 * Build a small asynchronous task runner that executes independent tasks concurrently, preserves task order in the final output, and rejects when a task fails.
 * @param {Promise[]} tasks An array of tasks. Each task is a function that returns a Promise.
 * 
## Requirements

- Start all tasks concurrently.
- Do not call the second task only after the first has completed.
- Preserve task order in the final result.
- If all tasks succeed, resolve with an array of results.
x- If any task rejects, reject with the original rejection reason.
x- Empty task array must resolve to `[]`.
x- Do not use native `Promise.all()`.
 */

const runTasks = (tasks) => {
  let result = []
  return new Promise((resolve, reject) => {
    // Empty task array must resolve to `[]`.
    if (tasks.length === 0) {
      resolve([])
    }
    // tasks must be Array if not rejected as invalid input.
    if (!Array.isArray(tasks)) {
      reject(new TypeError("Task must be an array"))
    }
    for (const task of tasks) {
      Promise.resolve(task())
      task()
        .then((response) => {
          result.push(response)
          if (result.length === tasks.length) {
            resolve(result)
          } else {
            return result
          }
        })
        .catch((reason) => {
          if (reason instanceof Error) {
            reject(reason.message)
          } else {
            reject(reason)
          }
        })
    }
  })
}
console.log(
  "Ex 10 Case 1 ### All succeed ->",
  await runTasks([() => delayResolve("A", 50), () => delayResolve("B", 10), () => delayResolve("C", 30)]),
) // ["A", "B", "C"]
console.log("Ex 10 Case 2 ### Empty array ->", await runTasks([])) // []

const tasks = [() => delayResolve("first", 300), () => delayResolve("second", 100), () => delayResolve("third", 200)]

console.log(
  "Ex 10 Case 3 ### One failure ->",
  await runTasks([() => delayResolve("A", 50), () => Promise.reject("ERROR"), () => delayResolve("C", 10)]),
) // Promise rejected with exactly "ERROR"
console.log(
  "Ex 10 Case 4 ### Concurrency ->",
  await runTasks([() => delayResolve("A", 300), () => delayResolve("B", 100), () => delayResolve("C", 200)]),
) // ["A", "B", "C"] 300 ms
