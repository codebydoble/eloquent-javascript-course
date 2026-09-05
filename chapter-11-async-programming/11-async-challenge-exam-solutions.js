/**
 * ════════════════════════════════════════════════════════════
 * Chapter 11 Async — Challenge Exam SOLUTIONS
 * Author: Yoandy Doble Herrera | Reviewed by: Claude
 * Score: 78/100 → All bugs fixed below
 * Run: node 11-async-challenge-exam-solutions.js
 * ════════════════════════════════════════════════════════════
 *
 * FIXES SUMMARY:
 *  Ex2  pipeline        — catch must rethrow, not return (resolves vs rejects)
 *  Ex5  retry           — attempts=0 must return Promise not undefined
 *  Ex5  retry           — shared `calls` counter resets between tests
 *  Ex7  runWithLimit    — indexGlobal race → use startIndex+i per batch
 *  Ex7  runWithLimit    — forEach ran all batches simultaneously → for+await
 *  Ex8  processQueue    — worker missing index arg
 *  Ex9  cancellableDelay — no pre-schedule check
 *  Ex10 runBatches      — tasks passed as Promises not functions
 *  Ex10 runBatches      — same race + non-sequential batch bugs as Ex7
 */

"use strict"

// ── Shared utilities ──────────────────────────────────────
const delayResolve = (input, ms) => new Promise((res) => setTimeout(() => res(input), ms))

const delayReject = (input, ms) => new Promise((_, rej) => setTimeout(() => rej(input), ms))

// ════════════════════════════════════════════════════════════
// Ex1 — normalizeResults (10/10 ✓ — no changes needed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 1 ================\n`)

/**
 * BASE CASE:       [] → resolves []
 * SUCCESS:         all values resolve → array in input order
 * FAILURE:         any rejects → reject with original reason
 * EXECUTION:       concurrent
 * ORDER INVARIANT: result[index] = val (not push)
 *
 * Your implementation was perfect. Keeping it unchanged as reference.
 */
function normalizeResults(values) {
  if (!Array.isArray(values)) return Promise.reject(new TypeError("Invalid type, must be an array."))
  if (values.length === 0) return Promise.resolve([])

  const results = new Array(values.length)
  let count = values.length
  let isRejected = false

  return new Promise((resolve, reject) => {
    values.forEach((prom, index) => {
      Promise.resolve(prom)
        .then((response) => {
          if (isRejected) return
          results[index] = response
          if (--count === 0) resolve(results)
        })
        .catch((reason) => {
          if (isRejected) return
          isRejected = true
          reject(reason)
        })
    })
  })
}

console.log("case 1:", await normalizeResults([delayResolve("slow", 100), "ordinary", delayResolve("fast", 10)]))
// [ 'slow', 'ordinary', 'fast' ] ✓

console.log("case 2:", await normalizeResults([]))
// [] ✓

try {
  await normalizeResults([Promise.reject("X")])
} catch (e) {
  console.log("case 3:", e)
}
// X ✓

try {
  await normalizeResults("bad")
} catch (e) {
  console.log("case 4:", e.message)
}
// Invalid type, must be an array. ✓

// ════════════════════════════════════════════════════════════
// Ex2 — pipeline (7/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 2 ================\n`)

/**
 * BASE CASE:       [] → returns initialValue unchanged
 * SUCCESS:         each step receives previous result, final result returned
 * FAILURE:         any step rejects → Promise rejects with original reason
 * EXECUTION:       strictly sequential
 * ORDER INVARIANT: step[n] always receives result of step[n-1]
 *
 * BUG: catch block returned error.message (string) — the Promise RESOLVED
 * with the string instead of REJECTING. Caller got "Stopped" as a resolved
 * value, indistinguishable from a real result.
 *
 * FIX: remove the catch entirely. async functions propagate rejection
 * automatically when an awaited Promise rejects. No try/catch needed here.
 * If you want to validate input, throw before the loop — that still rejects.
 */
async function pipeline(steps, initialValue) {
  if (!Array.isArray(steps)) throw new TypeError("Invalid type, must be an array.")

  if (steps.length === 0) return initialValue

  let result = initialValue
  for (const step of steps) {
    result = await step(result) // rejection propagates naturally — no catch
  }
  return result
}

console.log(
  "case 1:",
  await pipeline([(v) => Promise.resolve(v + 2), (v) => Promise.resolve(v * 3), (v) => Promise.resolve(v - 1)], 4),
)
// 17 ✓

console.log("case 2:", await pipeline([], 4))
// 4 ✓

try {
  await pipeline([(v) => Promise.resolve(v - 1), (v) => Promise.reject("Stopped"), (v) => Promise.resolve(v - 1)], 10)
} catch (e) {
  console.log("case 3 rejection:", e)
}
// "Stopped" — as a REJECTION not a resolution ✓

try {
  await pipeline(true, 10)
} catch (e) {
  console.log("case 4:", e.message)
}
// Invalid type, must be an array. ✓

// ════════════════════════════════════════════════════════════
// Ex3 — asyncMap (10/10 ✓ — no changes needed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 3 ================\n`)

/**
 * BASE CASE:       [] → resolves []
 * SUCCESS:         all mapper calls resolve → array in input order
 * FAILURE:         any rejects → reject immediately
 * EXECUTION:       concurrent
 * ORDER INVARIANT: result[index] = val (not push)
 *
 * Correct. Same pattern as Ex1 applied to mapper calls.
 */
function asyncMap(items, mapper) {
  if (!Array.isArray(items)) return Promise.reject(new TypeError("Type error: items must be an array."))
  if (items.length === 0) return Promise.resolve([])

  const results = new Array(items.length)
  let count = items.length
  let isRejected = false

  return new Promise((resolve, reject) => {
    items.forEach((item, index) => {
      Promise.resolve(mapper(item, index))
        .then((response) => {
          if (isRejected) return
          results[index] = response
          if (--count === 0) resolve(results)
        })
        .catch((reason) => {
          if (isRejected) return
          isRejected = true
          reject(reason)
        })
    })
  })
}

console.log("case 1:", await asyncMap(["A", "B", "C"], (v, i) => Promise.resolve(`${v}${i}`)))
// [ 'A0', 'B1', 'C2' ] ✓

console.log("case 2:", await asyncMap([], (v) => Promise.resolve(v)))
// [] ✓

// ════════════════════════════════════════════════════════════
// Ex4 — withTimeout (10/10 ✓ — no changes needed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 4 ================\n`)

/**
 * BASE CASE:       ms < 0 → RangeError; ms = 0 valid
 * SUCCESS:         promise settles before timer → original value/error
 * FAILURE:         timer fires first → Error("Timeout")
 * EXECUTION:       race between promise and timer
 * ORDER INVARIANT: first settler wins
 *
 * Correct. clearTimeout in both branches prevents timer leak.
 */
function withTimeout(promise, milliseconds) {
  if (typeof milliseconds !== "number" || Number.isNaN(milliseconds))
    return Promise.reject(new TypeError(`Type error: ${milliseconds} isn't a number.`))
  if (milliseconds < 0) return Promise.reject(new RangeError("RangeError: milliseconds must be >= 0"))

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), milliseconds)

    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

console.log("case 1:", await withTimeout(delayResolve("OK", 50), 100))
// "OK" ✓

try {
  await withTimeout(delayResolve("OK", 100), 50)
} catch (e) {
  console.log("case 2:", e.message)
}
// Timeout ✓

try {
  await withTimeout(delayResolve("OK", 50), -100)
} catch (e) {
  console.log("case 3:", e.constructor.name)
}
// RangeError ✓

// ════════════════════════════════════════════════════════════
// Ex5 — retry (8/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 5 ================\n`)

/**
 * BASE CASE:       attempts=0 → resolve immediately (no execution)
 *                  attempts<0 → RangeError
 * SUCCESS:         operation resolves → return value
 * FAILURE:         all attempts exhausted → reject with final error
 * EXECUTION:       strictly sequential (each retry waits for previous)
 * ORDER INVARIANT: attempt 1 always runs first
 *
 * BUG 1: `if (attempts === 0) return` — bare return gives undefined,
 * not a Promise. Any .then() chained on the result crashes.
 * FIX: return Promise.resolve() — spec says "must not execute operation"
 * which implies settling with empty success.
 *
 * BUG 2: `calls` counter was shared across all test cases.
 * Each test was affecting the others. Always reset shared state per test.
 */
function retry(operation, attempts) {
  if (typeof attempts !== "number" || Number.isNaN(attempts))
    return Promise.reject(new TypeError(`Type error: ${attempts} isn't a number.`))

  // FIX: return Promise.resolve() not bare return
  if (attempts === 0) return Promise.resolve()

  if (attempts < 0) return Promise.reject(new RangeError("RangeError: attempts must be >= 0"))

  return new Promise((resolve, reject) => {
    function loop(remaining) {
      operation()
        .then(resolve)
        .catch((err) => {
          if (remaining <= 1)
            reject(err) // exhausted — reject with LAST error
          else loop(remaining - 1)
        })
    }
    loop(attempts)
  })
}

// FIX: each test creates its own isolated counter
{
  let calls = 0
  const flaky = () => {
    calls++
    return calls < 3 ? Promise.reject("temporary") : Promise.resolve("success")
  }

  try {
    await retry(flaky, 1)
  } catch (e) {
    console.log("case 1 (1 attempt, fails):", e)
  }
  // "temporary" ✓

  // Reset for case 5:
  calls = 0
  console.log("case 5 (3 attempts, succeeds):", await retry(flaky, 3))
  // "success" ✓ — calls = 3 ✓
}

try {
  await retry(() => {}, NaN)
} catch (e) {
  console.log("case 2 (NaN):", e.message)
}
// Type error: NaN isn't a number. ✓

console.log("case 3 (0 attempts):", await retry(() => Promise.resolve("x"), 0))
// undefined (Promise resolves, no operation executed) ✓

try {
  await retry(() => {}, -3)
} catch (e) {
  console.log("case 4 (negative):", e.constructor.name)
}
// RangeError ✓

// ════════════════════════════════════════════════════════════
// Ex6 — firstSuccess (10/10 ✓ — no changes needed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 6 ================\n`)

/**
 * BASE CASE:       [] → rejects with []
 * SUCCESS:         first fulfilled value → resolve immediately
 * FAILURE:         all reject → reject with reasons in input order
 * EXECUTION:       concurrent (all start immediately)
 * ORDER INVARIANT: rejection reasons stored at original index
 *
 * Correct. allRejects[index] preserves input order.
 * count-- and reject when count===0 handles all-reject case.
 */
function firstSuccess(values) {
  if (!Array.isArray(values)) return Promise.reject(new TypeError("Invalid type, must be an array."))
  if (values.length === 0) return Promise.reject([])

  const allRejects = new Array(values.length)
  let count = values.length

  return new Promise((resolve, reject) => {
    values.forEach((prom, index) => {
      Promise.resolve(prom)
        .then((response) => resolve(response))
        .catch((reason) => {
          allRejects[index] = reason
          if (--count === 0) reject(allRejects)
        })
    })
  })
}

console.log("case 1:", await firstSuccess([delayReject("A", 100), delayResolve("B", 200), delayResolve("C", 300)]))
// "B" ✓

try {
  await firstSuccess([delayReject("A", 100), delayReject("B", 100), delayReject("C", 100)])
} catch (e) {
  console.log("case 2 all-reject:", e)
}
// ["A","B","C"] in input order ✓

try {
  await firstSuccess([])
} catch (e) {
  console.log("case 3 empty:", e)
}
// [] ✓

// ════════════════════════════════════════════════════════════
// Ex7 — runWithLimit (5/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 7 ================\n`)

/**
 * BASE CASE:       [] → []
 *                  limit <= 0 → RangeError
 * SUCCESS:         all tasks resolve → results in input order
 * FAILURE:         any task rejects → reject immediately, no new tasks
 * EXECUTION:       at most `limit` tasks concurrent at any time
 * ORDER INVARIANT: startIndex + localIndex tracks each task's global position
 *
 * BUG 1: indexGlobal was shared mutable state incremented by concurrent
 * .then() callbacks. Whichever task finished first got index 0, regardless
 * of its original position. Race condition guaranteed wrong order.
 *
 * FIX: capture startIndex before each batch starts, use startIndex+i
 * for each task within the batch. This is stable even under concurrency.
 *
 * BUG 2: forEach over tasksMatrix ran ALL batches simultaneously.
 * There was no waiting between batch 0 and batch 1.
 *
 * FIX: use for...of with await on each batch. The await makes the loop
 * pause until the current batch fully completes before starting the next.
 *
 * NOTE: splitTasks helper is kept from your solution — it's correct.
 */
async function runWithLimit(tasks, limit) {
  if (!Array.isArray(tasks)) throw new TypeError("Type error: tasks must be an array.")
  if (tasks.length === 0) return []
  if (typeof limit !== "number" || Number.isNaN(limit) || limit <= 0)
    throw new RangeError("RangeError: limit must be a positive integer.")

  // Split tasks into batches of size `limit`
  const batches = []
  const copy = [...tasks]
  while (copy.length > 0) batches.push(copy.splice(0, limit))

  const results = new Array(tasks.length)
  let globalStart = 0

  // FIX: for...of + await = truly sequential batches
  for (const batch of batches) {
    const batchStart = globalStart // capture stable index for this batch

    // FIX: await inner Promise — batch runs concurrently, loop waits for it
    await new Promise((resolve, reject) => {
      let done = 0
      batch.forEach((task, localIndex) => {
        task()
          .then((val) => {
            results[batchStart + localIndex] = val // FIX: stable index
            if (++done === batch.length) resolve()
          })
          .catch(reject) // reject outer Promise → for loop throws → function rejects
      })
    })

    globalStart += batch.length
  }

  return results
}

console.log(
  "case 1:",
  await runWithLimit(
    [() => delayResolve("A", 100), () => delayResolve("B", 50), () => delayResolve("C", 30), () => delayResolve("D", 20)],
    2,
  ),
)
// ["A","B","C","D"] ✓ — A and B run concurrently, then C and D

console.log("case 2 (empty):", await runWithLimit([], 2))
// [] ✓

try {
  await runWithLimit([], 0)
} catch (e) {
  console.log("case 3 (limit=0):", e.constructor.name)
}
// RangeError ✓

// ════════════════════════════════════════════════════════════
// Ex8 — processQueue (8/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 8 ================\n`)

/**
 * BASE CASE:       [] → []
 * SUCCESS:         all workers resolve → results array
 * FAILURE:         any worker rejects → reject immediately, stop loop
 * EXECUTION:       strictly sequential (one at a time)
 * ORDER INVARIANT: results.push in loop order = input order
 *
 * BUG: worker(items[index]) — missing second argument.
 * Spec: worker receives (item, index).
 * FIX: worker(items[index], index)
 *
 * Also: catch was returning error.message which resolves the Promise.
 * Same bug as Ex2. Removing try/catch lets rejection propagate naturally.
 */
const processQueue = async (items, worker) => {
  if (!Array.isArray(items)) throw new TypeError("Invalid type: items must be an array.")
  if (items.length === 0) return []

  const result = []
  for (let index = 0; index < items.length; index++) {
    // FIX: pass both item AND index to worker
    result.push(await worker(items[index], index))
  }
  return result
}

console.log("case 1:", await processQueue([2, 4, 6], (v) => Promise.resolve(v / 2)))
// [1, 2, 3] ✓

console.log("case 2:", await processQueue([2, 4, 6], (v, i) => Promise.resolve(`${v}-${i}`)))
// ['2-0','4-1','6-2'] ✓ — index now passed correctly

console.log("case 3 (empty):", await processQueue([], (v) => Promise.resolve(v)))
// [] ✓

try {
  await processQueue([1, 2, 3], (_, i) => (i === 1 ? Promise.reject("stop at index 1") : Promise.resolve("ok")))
} catch (e) {
  console.log("case 4 (stop on reject):", e)
}
// "stop at index 1" — worker at index 2 never runs ✓

// ════════════════════════════════════════════════════════════
// Ex9 — cancellableDelay (8/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 9 ================\n`)

/**
 * BASE CASE:       delay < 0 → RangeError
 *                  token.cancelled=true before call → reject immediately
 * SUCCESS:         token not cancelled before resolving → resolve(value)
 * FAILURE:         token cancelled before resolving → Error("Cancelled")
 * EXECUTION:       single timer
 * ORDER INVARIANT: pre-schedule check → timer check → resolve/reject
 *
 * BUG: no pre-schedule check. If token.cancelled is already true when
 * the function is called, the timer still scheduled and ran for `delay`ms
 * before checking. Spec: "check cancellation before scheduling."
 * FIX: check token.cancelled at the very start, before new Promise.
 */
const cancellableDelay = (value, delay, token) => {
  if (typeof delay !== "number" || delay < 0) return Promise.reject(new RangeError("RangeError: delay must be >= 0"))

  // FIX: pre-schedule check — reject immediately if already cancelled
  if (token.cancelled) return Promise.reject(new Error("Cancelled"))

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Post-delay check — cancelled during the wait
      if (token.cancelled) reject(new Error("Cancelled"))
      else resolve(value)
    }, delay)
  })
}

// Case 1: cancelled during delay (your original test)
{
  const token = { cancelled: false }
  const p = cancellableDelay("done", 100, token)
  setTimeout(() => {
    token.cancelled = true
  }, 20)
  try {
    await p
  } catch (e) {
    console.log("case 1 (cancelled during):", e.message)
  }
  // "Cancelled" ✓
}

// Case 2: already cancelled before call (new edge case from spec)
{
  const token = { cancelled: true }
  try {
    await cancellableDelay("done", 100, token)
  } catch (e) {
    console.log("case 2 (pre-cancelled):", e.message)
  }
  // "Cancelled" immediately, no 100ms wait ✓
}

// Case 3: not cancelled — resolves normally
{
  const token = { cancelled: false }
  console.log("case 3 (not cancelled):", await cancellableDelay("done", 50, token))
  // "done" ✓
}

// Case 4: negative delay
try {
  await cancellableDelay("x", -1, { cancelled: false })
} catch (e) {
  console.log("case 4 (negative):", e.constructor.name)
}
// RangeError ✓

// ════════════════════════════════════════════════════════════
// Ex10 — runBatches (2/10 → Fixed)
// ════════════════════════════════════════════════════════════
console.log(`\n=============== Ex 10 ================\n`)

/**
 * BASE CASE:       [] → []
 *                  batchSize <= 0 → RangeError
 * SUCCESS:         all tasks resolve → results in input order
 * FAILURE:         any task rejects → reject, no next batch starts
 * EXECUTION:       tasks within a batch = concurrent
 *                  batches themselves = sequential (await each)
 * ORDER INVARIANT: batchStart + localIndex for each task
 *
 * BUG 1: test passed Promises directly: delayResolve("A", 100)
 * These start immediately when created — by the time the function
 * receives them they're already running or resolved.
 * Spec: tasks must be FUNCTIONS that return Promises: () => delayResolve("A",100)
 * Functions are lazy — they don't start until called inside the function.
 *
 * BUG 2: task.then() called on a function → "task.then is not a function"
 * Fix: call the task first: task().then(...)
 *
 * BUG 3: Same indexGlobal race and non-sequential forEach as Ex7.
 * Fix: same pattern — for...of batches with await, batchStart + localIndex.
 *
 * The fix is structurally identical to runWithLimit.
 * Key difference: runWithLimit = sliding window, runBatches = fixed batches.
 */
const runBatches = async (tasks, batchSize) => {
  if (!Array.isArray(tasks)) throw new TypeError("Type error: tasks must be an array.")
  if (tasks.length === 0) return []
  if (typeof batchSize !== "number" || Number.isNaN(batchSize) || batchSize <= 0)
    throw new RangeError("RangeError: batchSize must be a positive integer.")

  // Split into fixed batches
  const batches = []
  const copy = [...tasks]
  while (copy.length > 0) batches.push(copy.splice(0, batchSize))

  const results = new Array(tasks.length)
  let globalStart = 0

  // Sequential across batches, concurrent within each batch
  for (const batch of batches) {
    const batchStart = globalStart

    await new Promise((resolve, reject) => {
      let done = 0
      batch.forEach((task, localIndex) => {
        // FIX: task() — call the function, THEN chain .then()
        task()
          .then((val) => {
            results[batchStart + localIndex] = val // stable index
            if (++done === batch.length) resolve()
          })
          .catch(reject)
      })
    })

    globalStart += batch.length
  }

  return results
}

// FIX: tasks are functions, not Promises
console.log(
  "case 1:",
  await runBatches(
    [
      () => delayResolve("A", 100), // ← function wrapping the Promise
      () => delayResolve("B", 50),
      () => delayResolve("C", 30),
      () => delayResolve("D", 20),
      () => delayResolve("E", 20),
    ],
    2,
  ),
)
// ["A","B","C","D","E"] ✓
// Batch 1: A+B concurrent, wait
// Batch 2: C+D concurrent, wait
// Batch 3: E, done

console.log("case 2 (empty):", await runBatches([], 2))
// [] ✓

try {
  await runBatches([], 0)
} catch (e) {
  console.log("case 3 (batchSize=0):", e.constructor.name)
}
// RangeError ✓

// Failure stops next batch:
try {
  await runBatches([() => delayResolve("A", 10), () => Promise.reject("batch1 fail"), () => delayResolve("C", 10)], 2)
} catch (e) {
  console.log("case 4 (reject stops batches):", e)
}
// "batch1 fail" — C never starts ✓

// ════════════════════════════════════════════════════════════
// THE TWO PATTERNS THAT POWER EX7 AND EX10
// ════════════════════════════════════════════════════════════
/**
 *
 * PATTERN A — Concurrent batch with stable order:
 *
 *   const batchStart = globalStart   // captured BEFORE the batch starts
 *   await new Promise((resolve, reject) => {
 *     let done = 0
 *     batch.forEach((task, localIndex) => {
 *       task()
 *         .then(val => {
 *           results[batchStart + localIndex] = val  // stable address
 *           if (++done === batch.length) resolve()
 *         })
 *         .catch(reject)
 *     })
 *   })
 *   globalStart += batch.length
 *
 * WHY batchStart + localIndex works:
 *   Even if task B (localIndex=1) finishes before task A (localIndex=0),
 *   B goes to results[batchStart+1] and A goes to results[batchStart+0].
 *   They never collide. Order is stable.
 *
 * PATTERN B — Tasks must be functions:
 *
 *   ✗ [delayResolve("A", 100), ...]    ← Promise already running
 *   ✓ [() => delayResolve("A", 100)]  ← function called when YOU decide
 *
 *   The function wrapping gives you control over WHEN the async work starts.
 *   This is the lazy evaluation pattern — same as thunks in Redux.
 */
