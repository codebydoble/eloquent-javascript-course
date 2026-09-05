/**
 * Chapter 11 Asynchronous Programming
 * Author: Yoandy Doble Herrera
 * Date: 2/09/2026
 */

/**
 * Function Normalize Async Results that run promises concurrently.
 * @param {Array} values any promise or value.
 * @returns {Promise} resolve with result array if resolves. If empty array resolves empty array otherwise rejected.
 */
function normalizeResults(values) {
  if (!Array.isArray(values)) {
    return Promise.reject(new TypeError(`Invalid type, must be an array.`))
  }
  if (values.length === 0) {
    return Promise.resolve([])
  }
  const results = new Array(values.length)
  let count = values.length
  let isRejected = false // first fail mark

  return new Promise((resolve, reject) => {
    values.forEach((prom, index) => {
      Promise.resolve(prom)
        .then((response) => {
          if (isRejected) return // stopped
          results[index] = response
          count--
          if (count === 0) {
            resolve(results)
          }
        })
        .catch((reason) => {
          if (isRejected) return // stopped
          isRejected = true
          return reject(reason)
        })
    })
  })
}

/**
 * Function that resolves a Promise using delay time.
 * @param {String|Number|Boolean|Array|Object|Map|Set} input any input data.
 * @param {Number} delay wait time.
 * @returns {Promise} return result promise after delay.
 */
const delayResolve = (input, delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(input), delay))
}

console.log(`\n=============== Ex 1 ================\n`)
/**
 * Function that resolves a Promise using delay time.
 * @param {String|Number|Boolean|Array|Object|Map|Set} input any input data.
 * @param {Number} delay wait time.
 * @returns {Promise} return result promise after delay.
 */
const delayReject = (input, delay) => {
  return new Promise((_, reject) => setTimeout(() => reject(input), delay))
}

console.log(">>> Ex 1 case 1: ", await normalizeResults([delayResolve("slow", 100), "ordinary", delayResolve("fast", 10)])) // [ 'slow', 'ordinary', 'fast' ]
console.log(">>> Ex 1 case 2: ", await normalizeResults([])) // []
const testEx1Case3 = async () => {
  try {
    await normalizeResults([delayResolve("slow", 100), delayResolve("slow", 100), delayResolve("slow", 100), Promise.reject("X")])
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 1 case 3: ", await testEx1Case3()) // X
const testEx1Case4 = async () => {
  try {
    await normalizeResults("Throw an error.")
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 1 case 4: ", await testEx1Case4()) // Invalid type, must be an array

console.log(`\n=============== Ex 2 ================\n`)
/**
 * Function Sequential Pipeline that execute strictly sequentially each step receives the previous result.
 * @param {Array} steps function array. Each function return a promise.
 * @param {any} initialValue any initial value. Function receives this value.
 * @returns {Promise} result promise.
 */
async function pipeline(steps, initialValue) {
  let result = undefined
  try {
    if (!Array.isArray(steps)) {
      throw new TypeError(`Invalid type, must be an array.`)
    }
    if (steps.length === 0) {
      return initialValue
    }
    for (let index = 0; index < steps.length; index++) {
      if (index === 0) {
        result = await steps[index](initialValue)
      } else {
        result = await steps[index](result)
      }
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(
  ">>> Ex 2 case 1: ",
  await pipeline(
    [(value) => Promise.resolve(value + 2), (value) => Promise.resolve(value * 3), (value) => Promise.resolve(value - 1)],
    4,
  ),
) // 17

console.log(">>> Ex 2 case 2: ", await pipeline([], 4)) // 4
console.log(
  ">>> Ex 2 case 3: ",
  await pipeline(
    [(value) => Promise.resolve(value - 1), (value) => Promise.reject("Stopped"), (value) => Promise.resolve(value - 1)],
    10,
  ),
) // "Stopped"
console.log(">>> Ex 2 case 4: ", await pipeline(true, 10)) // Invalid type, must be an array.

console.log(`\n=============== Ex 3 ================\n`)

/**
 * Function that Concurrent Mapping with Stable Order.
 * @param {Array} items any array.
 * @param {Function} mapper a map function that return a promise.
 * @returns {Promise} resolve with result array if resolves. If empty array resolves empty array otherwise rejected.
 * ```Requirements:```

- start all mapper calls concurrently
- preserve input order
- `[] -> []`
- do not mutate input
- do not use `Promise.all()`
 */
function asyncMap(items, mapper) {
  if (!Array.isArray(items)) {
    return Promise.reject(new TypeError(`Type error items param must be an array.`))
  }
  // [] -> []
  if (items.length === 0) {
    return Promise.resolve([])
  }
  const results = new Array(items.length)
  let count = items.length
  let isRejected = false // first fail mark

  return new Promise((resolve, reject) => {
    items.forEach((item, index) => {
      Promise.resolve(mapper(item, index))
        .then((response) => {
          if (isRejected) return // stopped
          results[index] = response
          count--
          if (count === 0) {
            resolve(results)
          }
        })
        .catch((reason) => {
          if (isRejected) return // stopped
          isRejected = true
          return reject(reason)
        })
    })
  })
}

console.log(
  ">>> Ex 3 case 1: ",
  await asyncMap(["A", "B", "C"], (value, index) => {
    return new Promise((resolve) => resolve(`${value}${index}`))
  }),
) // ["A0", "B1", "C2"]

console.log(`\n=============== Ex 4 ================\n`)

/**
 * Function Timeout Wrapper that apply timeout to a promise.
 * @param {Function} promise any function that returns a promise.
 * @param {Number} milliseconds time in milliseconds 
 * @returns {Promise} resolve with original result if Promise settles first. Reject with `Error("Timeout")` if timer wins
 * 
 * ```Requirements:```

- resolve with original result if Promise settles first
- reject with `Error("Timeout")` if timer wins
- preserve original rejection reason
- `milliseconds === 0` is valid
- negative milliseconds reject with `RangeError`
- clean up unnecessary timers
 */
function withTimeout(promise, milliseconds) {
  // param milliseconds !== number or NaN reject with `TypeError`
  if (typeof milliseconds !== "number" || Number.isNaN(milliseconds)) {
    return Promise.reject(new TypeError(`Type error: ${milliseconds} isn't a number.`))
  }
  // negative milliseconds reject with `RangeError`
  if (milliseconds < 0) {
    return Promise.reject(new RangeError("RangeError"))
  }
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      //  Timer wins
      return reject(new Error("Timeout"))
    }, milliseconds)

    promise
      .then((value) => {
        clearTimeout(timer) // Clear timeout if resolves
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timer) // Clear timeout if fails
        return reject(error)
      })
  })
}

console.log(">>> Ex 4 case 1: ", await withTimeout(delayResolve("OK", 50), 100)) // "OK"

const ex4Case2 = async () => {
  try {
    await withTimeout(delayResolve("OK", 100), 50)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 4 case 2: ", await ex4Case2()) // Error("Timeout")

const ex4Case3 = async () => {
  try {
    await withTimeout(delayResolve("OK", 50), "100")
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 4 case 3: ", await ex4Case3()) // Type error: 100 isn't a number.

const ex4Case4 = async () => {
  try {
    await withTimeout(delayResolve("OK", 50), -100)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 4 case 4: ", await ex4Case4()) // RangeError

console.log(`\n=============== Ex 5 ================\n`)

/**
 * Function Retry that retry operation until max attemps.
 * @param {Function} operation any function that returns a promise.
 * @param {Number} attempts attempts are maximum total executions 
 * @returns {Promise} fires success or reject reason.
 * 
 * ```Requirements:```

- attempts are maximum total executions
- retries are sequential
- stop immediately after success
- attempts `1` means execute once
- attempts `0` must not execute operation
- negative attempts reject with `RangeError`
- final failure rejects with final error
 */
function retry(operation, attempts) {
  // check attempts type
  if (typeof attempts !== "number" || Number.isNaN(attempts)) {
    return Promise.reject(new TypeError(`Type error: ${attempts} isn't a number.`))
  }
  // attempts `0` must not execute operation
  if (attempts === 0) return
  // attempts negative value RangeError
  if (attempts < 0) {
    return Promise.reject(new RangeError("RangeError"))
  }

  return new Promise((resolve, reject) => {
    function attemptLoop(tries) {
      operation()
        .then((response) => resolve(response))
        .catch((error) => {
          if (tries <= 1) {
            return reject(error)
          } else {
            attemptLoop(tries - 1)
          }
        })
    }
    attemptLoop(attempts)
  })
}

let calls = 0
const flaky = () => {
  calls++
  return calls < 3 ? Promise.reject("temporary") : Promise.resolve("success")
}

const ex5Case1 = async () => {
  try {
    await retry(flaky, 1)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 5 case 1: ", await ex5Case1()) // temporary
const ex5Case2 = async () => {
  try {
    await retry(flaky, NaN)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 5 case 2: ", await ex5Case2()) // Type error: NaN isn't a number.

const ex5Case3 = async () => {
  try {
    await retry(flaky, 0)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 5 case 3: ", await ex5Case3()) // undefined

const ex5Case4 = async () => {
  try {
    await retry(flaky, -3)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 5 case 4: ", await ex5Case4()) // RangeError
console.log(">>> Ex 5 case 5: ", await retry(flaky, 3)) // success

console.log(`\n=============== Ex 6 ================\n`)

/**
 * Implement First Successful Result manual Promise.any()
 * @param {Promise[]} values any functions array. Each function returns a promise.
 * @returns {Promise} first promise that resolves or array of reject reasons.
 * ```Requirements:```

- start all inputs concurrently
- resolve with first fulfilled value
- ordinary values allowed
- if all reject, reject with reasons in input order
- `[]` rejects with `[]`
- do not use `Promise.any()`
 */
function firstSuccess(values) {
  // checks type values
  if (!Array.isArray(values)) {
    return Promise.reject(new TypeError(`Invalid type, must be an array.`))
  }
  // []` rejects with `[]
  if (values.length === 0) {
    return Promise.reject([])
  }
  const allRejects = new Array(values.length)
  let count = values.length

  return new Promise((resolve, reject) => {
    values.forEach((prom, index) => {
      Promise.resolve(prom)
        .then((response) => {
          return resolve(response)
        })
        .catch((reason) => {
          allRejects[index] = reason
          count--
          if (count === 0) {
            return reject(allRejects)
          }
        })
    })
  })
}

console.log(">>> Ex 6 case 1: ", await firstSuccess([delayReject("A", 100), delayResolve("B", 200), delayResolve("C", 300)])) // B

const ex6Case2 = async () => {
  try {
    await firstSuccess([delayReject("Error A", 100), delayReject("Error C", 100), delayReject("Error B", 100)])
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 6 case 1: ", await ex6Case2()) // [ 'A', 'B', 'C' ]

console.log(`\n=============== Ex 7 ================\n`)

/* NOTE not returned result expected */

/**
 * Function Concurrency Limit that run tasks simultaneously until limit.
 * @param {Promise[]} tasks array of promises.
 * @param {Number} limit tasks running simultaneously. 
 *  @returns {Promise} array with resolves or first reject reason
 * ```Requirements:```

- at most `limit` tasks running simultaneously
- preserve input order
- `[] -> []`
- positive integer limit required
- each task executes once
- preserve rejection reason
- do not start additional tasks after rejection
*/
function runWithLimit(tasks, limit) {
  // checks tasks type: Array
  if (!Array.isArray(tasks)) {
    return Promise.reject(new TypeError("Type error tasks param isn't an array."))
  }
  // [] -> []
  if (tasks.length === 0) {
    return Promise.resolve([])
  }
  // checks limit type: Number
  if (typeof limit !== "number" || Number.isNaN(limit)) {
    return Promise.reject(new TypeError("Type error limit param isn't a number."))
  }
  // positive integer limit required
  if (limit <= 0) {
    return Promise.reject(new RangeError("Range error limit param isn't a positive integer."))
  }
  const results = new Array(tasks.length)
  let isReject = false
  // debo picar el arreglo en partes del tama;o de limit. Cada parte utilizar forEach.
  const tasksMatrix = []

  // copy original array
  const tasksCopy = [...tasks]
  /**
   * Function to split tasks
   * @param {Array} tasks a copy of original tasks
   * @param {Number} count same limit count for tasks array.
   */
  function splitTasks(tasks, count) {
    if (tasks.length <= 0) {
      return tasksMatrix
    }
    if (tasks.length < count) {
      tasksMatrix.push(tasks.splice(0))
      return tasksMatrix
    } else {
      tasksMatrix.push(tasks.splice(0, count))
      splitTasks(tasks, count)
    }
  }
  splitTasks(tasksCopy, limit)
  let indexGlobal = 0
  return new Promise((resolve, reject) => {
    tasksMatrix.forEach((tasksArr, index) => {
      tasksArr.map((prom) => {
        prom()
          .then((response) => {
            results[indexGlobal] = response
            indexGlobal++
            if (indexGlobal >= tasks.length) {
              resolve(results)
            }
          })
          .catch((reason) => {
            isReject = true
            return reject(reason)
          })
      })
    })
  })
}
console.log(
  ">>> Ex 7 case 1: ",
  await runWithLimit(
    [() => delayResolve("A", 100), () => delayResolve("B", 50), () => delayResolve("C", 30), () => delayResolve("D", 20)],
    2,
  ),
) // ["A", "B", "C", "D"]

console.log(`\n=============== Ex 8 ================\n`)

/**
 *
 * @param {Array} items
 * @param {Function} worker
 *
 * ```Requirements:```

- process strictly sequentially
- worker receives `(item, index)`
- `[] -> []`
- stop immediately after rejection
- do not start next worker after failure

 */
const processQueue = async (items, worker) => {
  let result = []
  try {
    if (!Array.isArray(items)) {
      throw new TypeError(`Invalid type, items must be an array.`)
    }
    if (items.length === 0) {
      return []
    }
    for (let index = 0; index < items.length; index++) {
      result.push(await worker(items[index]))
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}

console.log(">>> Ex 8 case 1: ", await processQueue([2, 4, 6], (value) => Promise.resolve(value / 2))) // [1, 2, 3]
console.log(">>> Ex 8 case 2: ", await processQueue([], (value) => Promise.resolve(value / 2))) // []
console.log(">>> Ex 8 case 3: ", await processQueue("Word", (value) => Promise.resolve(value / 2))) // Invalid type, items must be an array.

console.log(`\n=============== Ex 9 ================\n`)

/**
 * Function Cancellation Token that return a promise value if token isn't cancelled.
 * @param {any} value any resolved value. 
 * @param {Number} delay any time to schedule timeOut.
 * @param {Object} token an object with key cancelled.
 * @returns {Promise} if token cancelled return Error otherwise return resolve promise value.
 * 
 * ```Requirements:```

- check cancellation before scheduling
- check cancellation before resolving
- cancellation rejects with `Error("Cancelled")`
- negative delay rejects with `RangeError`

 */
const cancellableDelay = (value, delay, token) => {
  // negative delay rejects with `RangeError`
  if (delay < 0) {
    return Promise.reject(new RangeError("RangeError"))
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token.cancelled) {
        return reject(new Error("Cancelled"))
      } else {
        resolve(value)
      }
    }, delay)
  })
}

const token = { cancelled: false }
const promise = cancellableDelay("done", 100, token)

setTimeout(() => {
  token.cancelled = true
}, 20)

const testEx9Case1 = async () => {
  try {
    await promise
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
console.log(">>> Ex 9 case 1: ", await testEx9Case1()) // Cancelled

console.log(`\n=============== Ex 10 ================\n`)

/* NOTE not returned result expected */

/**
 * Function Async Batch Runner.
 * @param {Promise[]} tasks a list of task function that return a promise.
 * @param {Number} batchSize maximum task concurrently.
 * @returns {Promise} if all resolves obtain an array otherwise error or [] if task is [].
 * 
 * ```Requirements:```

- tasks inside a batch start concurrently
- next batch starts only after current batch succeeds
- preserve global input order
- `[] -> []`
- positive integer batch size required
- reject with original reason on failure
- do not start next batch after failure
- each task executes exactly once
- do not use `Promise.all()`
 */
const runBatches = async (tasks, batchSize) => {
  if (!Array.isArray(tasks)) {
    return Promise.reject(new TypeError(`Type error tasks param must be an array.`))
  }
  if (tasks.length === 0) {
    return Promise.resolve([])
  }
  if (typeof batchSize !== "number" || Number.isNaN(batchSize)) {
    return Promise.reject(new TypeError(`Type error batchSize param must be a number.`))
  }
  if (batchSize <= 0) {
    return Promise.reject(new Error(`Error batchSize param must be positive integer.`))
  }
  const results = new Array(tasks.length)
  let isReject = false
  const tasksCopy = [...tasks] // copy original array
  const batchs = [] // bidimensional array of batchs
  /**
   * Function to split tasks
   * @param {Array} tasks an array of task
   * @param {Number} batchSize same limit count for tasks array.
   */
  function splitTasks(tasks, batchSize) {
    if (tasks.length < batchSize) {
      batchs.push(tasks.splice(0))
      return batchs
    } else {
      batchs.push(tasks.splice(0, batchSize))
      splitTasks(tasks, batchSize)
    }
  }
  splitTasks(tasksCopy, batchSize)

  let indexGlobal = 0
  return new Promise((resolve, reject) => {
    batchs.forEach((tasksArr, index) => {
      tasksArr.map((task) => {
        task
          .then((response) => {
            results[indexGlobal] = response
            indexGlobal++
            if (indexGlobal >= tasks.length) {
              resolve(results)
            }
          })
          .catch((reason) => {
            isReject = true
            return reject(reason)
          })
      })
    })
  })
}

console.log(
  ">>> Ex 10 case 1: ",
  await runBatches(
    [delayResolve("A", 100), delayResolve("B", 50), delayResolve("C", 30), delayResolve("D", 20), delayResolve("E", 20)],
    2,
  ),
) // [A, B, C, D, E]
