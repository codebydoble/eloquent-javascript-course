/**
 * Chapter 11 Asynchronous Programming — Expert Solutions
 * Author: Yoandy Doble Herrera
 */
"use strict"

const logData = [
  1727265600000, 1727272800000, 1727294400000, 1727283600000, 1727098800000, 1727102400000, 1727113200000, 1727120400000,
]

function textFile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(logData.join("\n")), 50)
  })
}

const arrMap = () => {
  const map = Object.create(null)
  for (let i = 0; i < 24; i++) map[i] = 0
  return map
}

// ==========================================
// Exercise 1 — Async File Activity Table
// ==========================================
async function activityTable(day) {
  if (typeof day !== "number" || day < 0 || day > 6 || Number.isNaN(day)) {
    return new Array(24).fill(0)
  }
  try {
    const rawData = await textFile()
    if (!rawData.trim()) return new Array(24).fill(0)

    const timestamps = rawData
      .trim()
      .split("\n")
      .map((ts) => new Date(Number(ts)))
      .filter((date) => date.getDay() === day)
    if (timestamps.length === 0) return new Array(24).fill(0)
    const hours = timestamps.reduce((acc, date) => {
      acc[date.getHours()]++
      return acc
    }, arrMap())

    return Object.values(hours)
  } catch {
    return new Array(24).fill(0)
  }
}

// ==========================================
// Exercise 2 — Promise Chain Version
// ==========================================
function activityTablePromise(day) {
  if (typeof day !== "number" || day < 0 || day > 6 || Number.isNaN(day)) {
    return Promise.resolve(new Array(24).fill(0))
  }
  return textFile()
    .then((rawData) => {
      if (!rawData.trim()) return new Array(24).fill(0)
      const timestamps = rawData
        .trim()
        .split("\n")
        .map((ts) => new Date(Number(ts)))
        .filter((date) => date.getDay() === day)

      const hours = timestamps.reduce((acc, date) => {
        acc[date.getHours()]++
        return acc
      }, arrMap())

      return Object.values(hours)
    })
    .catch(() => new Array(24).fill(0))
}

// ==========================================
// Exercise 3 — Sequential vs Concurrent Reads
// ==========================================
function textFileEx3(filename) {
  const delays = { "a.txt": 100, "b.txt": 200, "c.txt": 150 }
  return new Promise((resolve) => {
    setTimeout(() => resolve(filename.toUpperCase()), delays[filename])
  })
}

async function readSequential(files) {
  if (!Array.isArray(files)) throw new TypeError("Input must be an array")
  const result = []
  for (const file of files) {
    result.push(await textFileEx3(file))
  }
  return result
}

async function readConcurrent(files) {
  if (!Array.isArray(files)) throw new TypeError("Input must be an array")
  return Promise.all(files.map((file) => textFileEx3(file)))
}

// ==========================================
// Exercise 4 — Collect In Order
// ==========================================
const collectInOrder = async (promises) => {
  if (!Array.isArray(promises)) throw new TypeError("Input must be an array")
  return Promise.all(promises)
}

// ==========================================
// Exercise 5 — Implement Custom Promise_all
// ==========================================

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Input must be an array"))
    }
    if (promises.length === 0) return resolve([])

    const results = new Array(promises.length)
    let pending = promises.length

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          results[index] = value
          pending--
          if (pending === 0) resolve(results)
        },
        (reason) => {
          reject(reason)
        },
      )
    })
  })
}

/*
const Promise_all = async (promises) => {
  try {
    if (!Array.isArray(promises)) {
      throw new TypeError("Input must be an array")
    }
    if (promises.length === 0) return []
    let results = []
    for (const promise of promises) {
      results.push(await promise)
    }
    return results
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    } else {
      return error
    }
  }
}
*/
/**
 * Function that resolves a Promise using delay time.
 * @param {String|Number|Boolean|Array|Object|Map|Set} input any input data.
 * @param {Number} delay wait time.
 * @returns {Promise} return result promise after delay.
 */
const delayResolve = (input, delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(input), delay))
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
// ==========================================
// Exercise 6 — Async Error Propagation
// ==========================================
const users = { 1: { id: 1, name: "Ada" }, 2: { id: 2, name: "Linus" } }
const orders = { 1: ["order-101", "order-102"], 2: [] }

function loadUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof id !== "number" || Number.isNaN(id)) {
        return reject(new TypeError("Invalid ID"))
      }
      users[id] ? resolve(users[id]) : reject("User not found")
    }, 50)
  })
}

function loadOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orders[userId] && orders[userId].length > 0) {
        resolve(orders[userId])
      } else {
        reject([]) // Rejects with empty array when no orders exist
      }
    }, 50)
  })
}

async function getUserOrders(id) {
  const user = await loadUser(id)
  try {
    const userOrders = await loadOrders(user.id)
    return { user, orders: userOrders }
  } catch (err) {
    if (Array.isArray(err) && err.length === 0) {
      return { user, orders: [] }
    }
    throw err
  }
}

// ==========================================
// Exercise 8 — Count Hours Base Case Fix
// ==========================================
function countHours(timestamps, day) {
  const filtered = timestamps.map((ts) => new Date(ts)).filter((date) => date.getDay() === day)

  const hours = filtered.reduce((acc, date) => {
    acc[date.getHours()]++
    return acc
  }, arrMap())

  return Object.values(hours)
}

// ==========================================
// Exercise 9 — Retry with Explicit Base Case
// ==========================================
function retry(operation, attempts) {
  return new Promise((resolve, reject) => {
    if (attempts < 0) return reject(new RangeError("invalid input"))
    if (attempts === 0) return

    function attempt(remaining) {
      operation()
        .then(resolve)
        .catch((error) => {
          if (remaining <= 1) {
            reject(error)
          } else {
            attempt(remaining - 1)
          }
        })
    }

    attempt(attempts)
  })
}

// ==========================================
// Exercise 10 — Async Task Runner
// ==========================================
const runTasks = (tasks) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(tasks)) return reject(new TypeError("Tasks must be an array"))
    if (tasks.length === 0) return resolve([])

    try {
      const promises = tasks.map((task) => Promise.resolve(task()))
      Promise_all(promises).then(resolve, reject)
    } catch (err) {
      reject(err)
    }
  })
}
