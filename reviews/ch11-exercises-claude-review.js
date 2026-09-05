/**
 * ════════════════════════════════════════════════════════════
 * ELOQUENT JS — Chapter 11: Asynchronous Programming
 * REVIEW + CORRECTED SOLUTIONS
 * Author: Yoandy Doble Herrera | Senior Review: Claude
 * Run: node ch11-exercises-review.js
 * ════════════════════════════════════════════════════════════
 *
 * SCORES:
 *  Ex11.1  activityTable (async/await)   24/30   3 bugs
 *  Ex11.2  activityTable (Promises)      25/30   same bugs carry over
 *  Ex11.3  Promise_all implementation    18/40   2 critical bugs
 * ────────────────────────────────────────────────────────────
 *  TOTAL                                 67/100   near-pass
 *
 * YOUR NOTE: "In Ex11.3 the array of results aren't in the same order
 * as the input" — you identified the critical bug yourself before review.
 * That is senior-level self-awareness.
 *
 * BUGS SUMMARY:
 *  B1 (all exercises) — top-level `import { error } from "console"`
 *     Unused import causes parse warning; `error` shadows no-one but is dead code.
 *  B2 (11.1 / 11.2) — reduce returns object on empty day, not array
 *     When no timestamps match the day, reduce never fires the `if (last index)`
 *     branch, so it returns the initial accumulator object {0:0,1:0,...}.
 *     activityGraph then receives an object, Math.max(...object) returns NaN
 *     and the whole graph is corrupted.
 *  B3 (11.1 / 11.2) — getUTCHours() vs getHours()
 *     Book uses getHours() (local time). getUTCHours() is correct ONLY if
 *     you are in UTC timezone. For any other timezone the hour buckets shift.
 *     In THIS dataset with this server timezone they happen to match — but
 *     the book's camera_logs.txt would contain local-time logs, so getHours().
 *  B4 (11.3) — order bug: push() instead of result[index] = val
 *     Promises resolve in race order, not input order.
 *     Confirmed: [soon(1,300ms), soon(2,100ms), soon(3,200ms)] → [2,3,1]
 *  B5 (11.3) — rejection wrapping: reject(`Rejected ${reason}`)
 *     The book's test checks: if (error != "X") console.log("Unexpected failure")
 *     Your code rejects with "Rejected X" — which is !== "X" — test fails.
 *     The fix: reject(reason) not reject(`Rejected ${reason}`)
 */

"use strict"

// ── Shared textFile simulation ───────────────────────────
// (Your hardcoded approach is correct — the book's readFile is unavailable
//  without the actual txt files. This is the right workaround.)
const HARDCODED_CONTENT =
  "1727265600000\n1727272800000\n1727294400000\n1727283600000\n" +
  "1727098800000\n1727102400000\n1727113200000\n1727120400000\n" +
  "1727138400000\n1695709940692\n1695701068331\n1727308800000\n" +
  "1786346710025\n1777681510025\n1787055910025\n1695701189163\n"

/**
 * Simulates reading a file. Resolves with hardcoded content.
 * In production this would be: readFile(filename, "utf8", callback)
 * wrapped in a Promise.
 * @param {String} filename any filename string.
 * @returns {Promise<String>} file content.
 */
function textFile(filename) {
  return new Promise((resolve, reject) => {
    if (typeof filename !== "string" || filename.trim() === "") {
      reject(new Error(`ENOENT: no such file '${filename}'`))
    } else {
      resolve(HARDCODED_CONTENT)
    }
  })
}

/**
 * Creates the initial 24-hour accumulator object.
 * Extracted to a function to avoid repetition in both exercises.
 * @returns {Object} {0:0, 1:0, ... 23:0}
 */
const emptyHourMap = () => {
  const map = {}
  for (let h = 0; h < 24; h++) map[h] = 0
  return map
}

/**
 * Converts the 24-hour log array into an ASCII bar chart.
 * @param {Number[]} table array of 24 counts.
 * @returns {String} visual bar chart.
 */
const activityGraph = (table) => {
  if (!Array.isArray(table)) {
    return "activityGraph ERROR: received non-array input"
  }
  const max = Math.max(...table)
  const scale = 40 / (max || 1)
  let result = "Activity by hour:\n"
  for (let h = 0; h < 24; h++) {
    const count = table[h] ?? 0
    const bar = "#".repeat(Math.round(count * scale))
    const hour = String(h).padStart(2, "0")
    result += `${hour}: ${bar} (${count})\n`
  }
  return result
}

// ════════════════════════════════════════════════════════════
// Ex11.1 — activityTable with async/await (24/30 → Fixed)
// ════════════════════════════════════════════════════════════
console.log("\n # Exercise 11.1: activityTable (async/await) \n")

/**
 * BUGS FIXED:
 *
 * B2 — Empty day returns initial object, not array.
 *   ORIGINAL: reduce fires the "return Object.values(activity)" only on the
 *   LAST element. If the filtered array is empty, reduce NEVER fires → it
 *   returns the initial accumulator ({0:0,...}) not Object.values([]).
 *
 *   FIX: Run reduce normally to build the map, THEN call Object.values()
 *   OUTSIDE the reduce. This always returns an array of 24 numbers,
 *   even when the filtered list is empty.
 *
 * B3 — getUTCHours() vs getHours().
 *   The book's data is local-time camera logs. getHours() is correct.
 *   getUTCHours() shifts all hours unless you're in UTC+0.
 *   Your hardcoded data happens to be UTC so both return the same value here,
 *   but the correct method per the book is getHours().
 *
 * WHAT'S CORRECT ✓:
 *   - async/await pattern ✓
 *   - textFile called correctly ✓
 *   - trim().split("\n") to parse file ✓
 *   - map to Date, filter by getDay() ✓
 *   - try/catch for error handling ✓
 *
 * @param {Number} day 0 (Sunday) – 6 (Saturday).
 * @returns {Promise<Number[]>} array of 24 counts.
 */
const activityTable = async (day) => {
  try {
    const logFileList = await textFile("camera_logs.txt")

    // Parse filenames from the file list
    const fileNames = logFileList.trim().split("\n")

    // In the real exercise this would be:
    //   const files = await Promise.all(fileNames.map(f => textFile(f)))
    //   const allTimestamps = files.flatMap(f => f.trim().split("\n"))
    // Here our single file IS the log, so we use fileNames directly as timestamps

    const timestamps = fileNames.map((ts) => new Date(Number(ts))).filter((ts) => ts.getDay() === day)

    // FIX B2: reduce builds the map, Object.values() converts AFTER
    // This always produces an array, even for empty timestamp lists
    const hourMap = timestamps.reduce((acc, ts) => {
      const hour = ts.getHours() // FIX B3: getHours() not getUTCHours()
      acc[hour] = acc[hour] + 1
      return acc
    }, emptyHourMap())

    return Object.values(hourMap) // ← always an array of 24 numbers
  } catch (err) {
    console.error("activityTable error:", err.message)
    return new Array(24).fill(0) // safe fallback — caller always gets an array
  }
}

// Test all days:
;(async () => {
  console.log("Monday (1) activity:")
  const mon = await activityTable(1)
  console.log(activityGraph(mon))

  console.log("Wednesday (3) activity:")
  const wed = await activityTable(3)
  console.log(activityGraph(wed))

  console.log("Sunday (0) — no data, should return 24 zeros:")
  const sun = await activityTable(0)
  console.log(
    "Is array:",
    Array.isArray(sun),
    "| length:",
    sun.length,
    "| sum:",
    sun.reduce((a, b) => a + b, 0),
  )
  console.log(activityGraph(sun)) // no crash ✓
})()

// ════════════════════════════════════════════════════════════
// Ex11.2 — activityTable with Promise chain (25/30 → Fixed)
// ════════════════════════════════════════════════════════════
console.log("\n # Exercise 11.2: activityTable (Promise chain) \n")

/**
 * SAME BUGS as 11.1, SAME FIXES.
 *
 * WHAT'S CORRECT ✓:
 *   - No async/await — pure .then() chain as spec requires ✓
 *   - Promise.all([textFile(...)]) wrapping ✓
 *   - .then().then().catch() chain structure ✓
 *   - Data flows through the chain correctly ✓
 *
 * DISCUSSION ANSWERS (from your .md):
 *
 * Q1: Sequential await vs Promise.all — which is faster?
 *    Promise.all is faster. Sequential await reads each file one by one
 *    (total time = sum of all file read times). Promise.all starts all
 *    reads simultaneously (total time = slowest file only).
 *    Your answer: ✓ correct.
 *
 * Q2: How does a typo in filename reach the returned Promise?
 *    textFile(badName) rejects → .catch() in the chain receives it →
 *    it's returned as the resolved value of the Promise (or re-thrown).
 *    Your answer: partially correct. More precisely: the rejection
 *    propagates through the .then() chain automatically until it hits .catch().
 *    You don't need to check for it manually at each step.
 *
 * @param {Number} day 0 (Sunday) – 6 (Saturday).
 * @returns {Promise<Number[]>} array of 24 counts.
 */
const activityTable2 = (day) => {
  return textFile("camera_logs.txt")
    .then((logFileList) => {
      const fileNames = logFileList.trim().split("\n")
      // Real exercise: return Promise.all(fileNames.map(f => textFile(f)))
      // Here: fileNames ARE the timestamps
      return fileNames
    })
    .then((fileNames) => {
      const timestamps = fileNames.map((ts) => new Date(Number(ts))).filter((ts) => ts.getDay() === day)

      // FIX B2: reduce then Object.values() outside
      const hourMap = timestamps.reduce((acc, ts) => {
        const hour = ts.getHours() // FIX B3: getHours()
        acc[hour] = acc[hour] + 1
        return acc
      }, emptyHourMap())

      return Object.values(hourMap) // always an array ✓
    })
    .catch((err) => {
      console.error("activityTable2 error:", err.message)
      return new Array(24).fill(0)
    })
}

activityTable2(1).then((table) => {
  console.log("activityTable2 Monday result (is array):", Array.isArray(table))
  console.log(activityGraph(table))
})

activityTable2(0).then((table) => {
  console.log(
    "activityTable2 Sunday (empty day):",
    Array.isArray(table),
    "sum:",
    table.reduce((a, b) => a + b, 0),
  )
})

// ════════════════════════════════════════════════════════════
// Ex11.3 — Promise_all implementation (18/40 → Fixed)
// ════════════════════════════════════════════════════════════
console.log("\n # Exercise 11.3: Building Promise.all \n")

/**
 * BUGS:
 *
 * B4 — ORDER BUG (you identified this yourself ✓)
 *   ORIGINAL: result.push(val) — pushes in RESOLUTION order (race order).
 *   Promises resolve as fast as they can, not in array order.
 *   Demonstrated: [soon(1,300ms), soon(2,100ms), soon(3,200ms)] → [2,3,1]
 *   This is a RACE CONDITION — the output order depends on timing.
 *   On a fast machine or lucky random seed it might look correct. It isn't.
 *
 *   FIX: pre-allocate result array, use index to place each value:
 *     const result = new Array(promises.length)
 *     result[index] = val  ← index captured in forEach closure
 *
 * B5 — REJECTION WRAPPING
 *   ORIGINAL: reject(`Rejected ${reason}`)
 *   The book's test checks: if (error != "X")
 *   Your code produces "Rejected X" which !== "X" → "Unexpected failure" prints.
 *   The test FAILS.
 *
 *   FIX: reject(reason) — pass the raw reason through unchanged.
 *
 * WHAT'S CORRECT ✓:
 *   - Returns a new Promise ✓
 *   - Handles empty array edge case ✓
 *   - Resolves when all promises resolve ✓
 *   - Rejects when any promise rejects ✓
 *   - Once rejected, further resolves are ignored ✓ (Promise is already settled)
 *
 * HOW THE INDEX FIX WORKS:
 *   forEach gives you the index for each iteration.
 *   The arrow function inside .then() closes over that index.
 *   Each promise's result lands at its original position regardless of timing.
 *
 *   Promise 0 resolves last  → result[0] = val0
 *   Promise 1 resolves first → result[1] = val1
 *   Promise 2 resolves mid   → result[2] = val2
 *   When resolvedCount === promises.length → resolve([val0, val1, val2]) ✓
 *
 * @param {Promise[]} promises array of Promises (or values).
 * @returns {Promise<Array>} resolves with array of results in input order.
 */
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Edge case: empty array resolves immediately with []
    if (promises.length === 0) {
      resolve([])
      return
    }

    // FIX B4: pre-allocate with correct length, track by index
    const result = new Array(promises.length)
    let resolvedCount = 0

    promises.forEach((promise, index) => {
      // Promise.resolve() handles non-Promise values gracefully
      Promise.resolve(promise)
        .then((val) => {
          result[index] = val // ← store at original index, not push
          resolvedCount++

          if (resolvedCount === promises.length) {
            resolve(result) // ← all done, order preserved ✓
          }
        })
        .catch((reason) => {
          reject(reason) // FIX B5: raw reason, no wrapping
        })
    })
  })
}

// ── Book's test suite — all must pass ────────────────────
console.log("--- Book tests ---")

Promise_all([]).then((array) => {
  console.log("✓ Empty array:", array) // []
})

function soon(val) {
  return new Promise((resolve) => setTimeout(() => resolve(val), Math.random() * 500))
}

Promise_all([soon(1), soon(2), soon(3)]).then((array) => {
  const correct = JSON.stringify(array) === "[1,2,3]"
  console.log(`${correct ? "✓" : "✗"} Should be [1,2,3]:`, array)
})

Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(() => {
    console.log("✗ We should NOT reach here")
  })
  .catch((error) => {
    if (error !== "X") {
      console.log("✗ Unexpected failure:", error)
    } else {
      console.log("✓ Rejection reason correct:", error)
    }
  })

// ── Deterministic order proof ────────────────────────────
console.log("\n--- Order guarantee proof ---")

const fixedSoon = (val, ms) => new Promise((res) => setTimeout(() => res(val), ms))

Promise_all([
  fixedSoon(1, 300), // slowest
  fixedSoon(2, 100), // fastest
  fixedSoon(3, 200), // middle
]).then((arr) => {
  const correct = arr[0] === 1 && arr[1] === 2 && arr[2] === 3
  console.log(`${correct ? "✓" : "✗"} Order preserved (resolves: 2→3→1, stored: 1,2,3):`, arr)
})

// ── Additional edge cases ────────────────────────────────
console.log("\n--- Edge cases ---")

// Non-Promise values (Promise.resolve wraps them)
Promise_all([1, 2, 3]).then((arr) => {
  console.log("✓ Non-Promise values:", arr) // [1, 2, 3]
})

// Multiple rejections — first one wins, rest ignored
Promise_all([Promise.reject("first"), Promise.reject("second"), Promise.resolve("third")]).catch((reason) => {
  console.log("✓ First rejection wins:", reason) // "first"
})

// Mixed: some async, some sync values
Promise_all([soon(1), "immediate", soon(3)]).then((arr) => {
  console.log("✓ Mixed async/sync:", arr) // [1, "immediate", 3]
})

// ════════════════════════════════════════════════════════════
// MASTER CONCEPTS — What Chapter 11 is really teaching
// ════════════════════════════════════════════════════════════
/**
 *
 * ── 11.1 teaches: async/await is just syntax over Promises ────
 *   You read files sequentially: await textFile(name1) → await textFile(name2)
 *   The code looks synchronous but runs asynchronously.
 *
 * ── 11.2 teaches: async/await and Promises are equivalent ─────
 *   Same logic, pure .then() chains.
 *   Key insight: in 11.1 you COULD await in a loop (sequential).
 *   In 11.2 you MUST use Promise.all (parallel) — it forces you to
 *   think about concurrent vs sequential execution.
 *
 *   Sequential (loop + await): t1 + t2 + t3 total time
 *   Parallel (Promise.all):    max(t1, t2, t3) total time
 *
 *   In the real camera_logs exercise with 10 files:
 *   Sequential: 10 × 100ms = 1000ms
 *   Parallel:   max(100ms) = 100ms  ← 10x faster
 *
 * ── 11.3 teaches: how Promise.all actually works inside ────────
 *   The key insight: you must track results BY INDEX, not by push order.
 *   This is the foundational pattern for any "wait for N concurrent tasks"
 *   implementation.
 *
 *   In React: this is exactly what React Query, SWR, and Suspense do
 *   internally — tracking concurrent data fetches by their identifiers.
 *
 * ── The reduce pattern in 11.1/11.2 ──────────────────────────
 *   The accumulate-then-convert pattern:
 *     1. Reduce to build a map (preserve keys/structure)
 *     2. Object.values() to convert to array AFTER
 *   This is cleaner than trying to return Object.values() conditionally
 *   from inside the reduce callback.
 *
 * ── getHours() vs getUTCHours() ──────────────────────────────
 *   Always ask: "is this data stored in local time or UTC?"
 *   Camera logs → local time → getHours()
 *   Server logs → UTC → getUTCHours()
 *   API timestamps → UTC ISO strings → parse with Date, use getUTCHours()
 */
