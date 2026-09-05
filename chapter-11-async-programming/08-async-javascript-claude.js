/**
 * ════════════════════════════════════════════════════════════
 * ASYNC JAVASCRIPT — Complete Study Guide
 * Senior Fullstack Teacher Approach
 * Author: Claude | Student: Yoandy Doble Herrera
 * ════════════════════════════════════════════════════════════
 *
 * TOPICS COVERED:
 *  1.  The JavaScript runtime — call stack, Web APIs, event loop, queues
 *  2.  setTimeout / setInterval — the gateway to async thinking
 *  3.  Callbacks — the original async pattern (and why they break)
 *  4.  Promises — the solution to callback hell
 *  5.  Promise chaining — composing async operations
 *  6.  Promise combinators — all, allSettled, race, any
 *  7.  async/await — syntactic sugar over Promises
 *  8.  try/catch with async/await — error handling
 *  9.  async/await + Promises mixed patterns
 * 10.  Real-world patterns you'll use in React
 */

// ════════════════════════════════════════════════════════════
// PART 1 — THE JAVASCRIPT RUNTIME
// Why async exists at all
// ════════════════════════════════════════════════════════════

/**
 * JavaScript is SINGLE-THREADED.
 * One call stack. One thing at a time. No parallelism.
 *
 * So how does it handle:
 *   - Network requests (fetch)
 *   - Timers (setTimeout)
 *   - File reading (Node.js fs)
 *   - User events (click, input)
 * ...without freezing?
 *
 * Answer: the EVENT LOOP architecture.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │                   JS ENGINE                          │
 * │   ┌──────────────┐    ┌──────────────────────────┐  │
 * │   │  CALL STACK  │    │    MEMORY HEAP           │  │
 * │   │              │    │  (object allocation)     │  │
 * │   │  main()      │    └──────────────────────────┘  │
 * │   │  greet()     │                                   │
 * │   │  console.log │                                   │
 * │   └──────────────┘                                   │
 * └──────────────────────────┬──────────────────────────┘
 *                            │
 * ┌──────────────────────────▼──────────────────────────┐
 * │              BROWSER / NODE APIs                     │
 * │   setTimeout, fetch, DOM events, fs.readFile...     │
 * │   (these run OUTSIDE the JS engine)                 │
 * └──────────────────────────┬──────────────────────────┘
 *                            │ when done, push callback to queue
 * ┌──────────────────────────▼──────────────────────────┐
 * │           TASK QUEUES                                │
 * │  Microtask Queue  │  Macrotask Queue                 │
 * │  (Promises)       │  (setTimeout, setInterval)      │
 * │  HIGHER PRIORITY  │  LOWER PRIORITY                  │
 * └──────────────────────────┬──────────────────────────┘
 *                            │
 * ┌──────────────────────────▼──────────────────────────┐
 * │              EVENT LOOP                              │
 * │  "Is the call stack empty?                          │
 * │   → drain ALL microtasks first                      │
 * │   → then pick ONE macrotask                         │
 * │   → repeat"                                         │
 * └─────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: JavaScript doesn't wait. It delegates to the browser/Node,
 * keeps running, and comes back when the result is ready.
 * Async is the mechanism that makes this work without threads.
 */

// ════════════════════════════════════════════════════════════
// PART 2 — setTimeout / setInterval / clearTimeout
// The simplest async primitives
// ════════════════════════════════════════════════════════════

console.log("\n════ PART 2: setTimeout ════\n")

/**
 * setTimeout(callback, delay) — schedules a callback after AT LEAST `delay` ms.
 * It's "at least" not "exactly" because the event loop must be free first.
 */

console.log("A — synchronous")

setTimeout(() => {
  console.log("C — after 0ms timeout")
}, 0)

console.log("B — synchronous")

// Output: A → B → C
// Even with 0ms delay, setTimeout goes to the macrotask queue.
// The call stack (A and B) drains first, THEN the event loop picks up C.
// This proves: setTimeout(fn, 0) doesn't mean "run now" — it means
// "run after current synchronous code finishes"

// ── clearTimeout ─────────────────────────────────────────
console.log("\n── clearTimeout ──")

const timerId = setTimeout(() => {
  console.log("This will NEVER run")
}, 1000)

clearTimeout(timerId) // cancelled before it fires
console.log("Timer cancelled — callback will not execute")

// ── setInterval ──────────────────────────────────────────
console.log("\n── setInterval (runs 3 times then stops) ──")

let count = 0
const intervalId = setInterval(() => {
  count++
  console.log(`Tick ${count}`)
  if (count === 3) {
    clearInterval(intervalId)
    console.log("Interval cleared")
  }
}, 100)

// ── CRITICAL: The setTimeout callback trap ────────────────
/**
 * setTimeout does NOT return a value from the callback.
 * This is the first mental model shift required for async thinking.
 *
 * WRONG thinking (synchronous mindset):
 */

const wrongWay = () => {
  let result
  setTimeout(() => {
    result = "the answer"  // runs LATER
  }, 100)
  return result  // undefined — callback hasn't run yet!
}

console.log("\nWrong sync approach:", wrongWay()) // undefined

/**
 * This is WHY we need callbacks, Promises, and async/await.
 * You can't "return" from the future. You have to HANDLE the future
 * when it arrives.
 */


// ════════════════════════════════════════════════════════════
// PART 3 — CALLBACKS: The Original Async Pattern
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 3: Callbacks ════\n")

/**
 * A callback is simply: "here's a function — call it when you're done."
 * This is how all Node.js APIs originally worked.
 */

// ── Simple callback pattern ───────────────────────────────
/**
 * Simulates a database query (takes 200ms).
 * @param {Number} userId
 * @param {Function} callback (error, data) — Node.js convention: error-first
 */
const getUserFromDB = (userId, callback) => {
  setTimeout(() => {
    if (userId <= 0) {
      callback(new Error("Invalid userId"), null)
      return
    }
    callback(null, { id: userId, name: "Yoandy", role: "developer" })
  }, 200)
}

getUserFromDB(1, (error, user) => {
  if (error) {
    console.log("Error:", error.message)
    return
  }
  console.log("User from DB:", user)
})

// ── Callback Hell (Pyramid of Doom) ──────────────────────
/**
 * Now imagine you need to: get user → get their orders → get order details
 * Each step depends on the previous. With callbacks:
 */

const getOrders = (userId, callback) => {
  setTimeout(() => callback(null, [{ id: 101, item: "Laptop" }]), 150)
}

const getOrderDetails = (orderId, callback) => {
  setTimeout(() => callback(null, { id: orderId, price: 1200, status: "shipped" }), 100)
}

// This is CALLBACK HELL:
getUserFromDB(1, (err1, user) => {
  if (err1) return console.log(err1)
  getOrders(user.id, (err2, orders) => {
    if (err2) return console.log(err2)
    getOrderDetails(orders[0].id, (err3, details) => {
      if (err3) return console.log(err3)
      console.log(`\nCallback hell result: User ${user.name} ordered ${details.id} - $${details.price}`)
      // Imagine 2 more levels... this grows rightward forever
      // Error handling must be repeated at every level
      // Impossible to share errors across levels cleanly
    })
  })
})

/**
 * Problems with callbacks:
 * 1. Rightward drift — code grows horizontally, impossible to read
 * 2. Error handling duplicated at every level
 * 3. Can't use try/catch — errors happen in future callbacks
 * 4. Can't return values — callbacks don't compose
 * 5. "Inversion of control" — you give YOUR function to someone else to call
 *    What if they call it twice? Never? With wrong args?
 *
 * Promises solve all of this.
 */


// ════════════════════════════════════════════════════════════
// PART 4 — PROMISES: Taking Back Control
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 4: Promises ════\n")

/**
 * A Promise represents a VALUE that doesn't exist yet but will in the future.
 * It's an OBJECT that holds the state of an async operation.
 *
 * THREE STATES — a Promise can only be in one at a time:
 *
 *   PENDING   → the async operation is still running
 *   FULFILLED → the operation succeeded (.then() fires)
 *   REJECTED  → the operation failed (.catch() fires)
 *
 * Once settled (fulfilled or rejected), a Promise NEVER changes state.
 * It's immutable after resolution — this is the guarantee that makes
 * Promises reliable.
 *
 * ┌──────────┐
 * │ PENDING  │──── resolve(value) ──→ FULFILLED ──→ .then(value)
 * │          │──── reject(error)  ──→ REJECTED  ──→ .catch(error)
 * └──────────┘
 */

// ── Creating a Promise ────────────────────────────────────
/**
 * new Promise((resolve, reject) => { ... })
 *   resolve(value) — call this when the operation succeeds
 *   reject(error)  — call this when the operation fails
 */

const getUserPromise = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error(`Invalid userId: ${userId}`))
        return
      }
      resolve({ id: userId, name: "Yoandy", role: "developer" })
    }, 200)
  })
}

// ── Consuming a Promise: .then() / .catch() / .finally() ─
getUserPromise(1)
  .then((user) => {
    console.log("Promise resolved:", user)
    return user.name  // values returned from .then() are wrapped in a new Promise
  })
  .then((name) => {
    console.log("Chained then — name:", name)
  })
  .catch((error) => {
    console.log("Promise rejected:", error.message)
  })
  .finally(() => {
    console.log("Finally — always runs (loading spinner off)")
  })

// Error case:
getUserPromise(-1)
  .then((user) => console.log("This won't run:", user))
  .catch((error) => console.log("Error caught:", error.message))

// ── Promise chaining — replacing callback hell ────────────
console.log("\n── Promise chaining ──")

const getOrdersPromise = (userId) =>
  new Promise((resolve) =>
    setTimeout(() => resolve([{ id: 101, item: "Laptop" }]), 150)
  )

const getOrderDetailsPromise = (orderId) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id: orderId, price: 1200, status: "shipped" }), 100)
  )

// Flat, readable, errors handled ONCE at the bottom:
getUserPromise(1)
  .then((user) => {
    console.log("Step 1 — user:", user.name)
    return getOrdersPromise(user.id)  // return a new Promise to chain
  })
  .then((orders) => {
    console.log("Step 2 — orders:", orders.length, "orders")
    return getOrderDetailsPromise(orders[0].id)
  })
  .then((details) => {
    console.log("Step 3 — order details: $" + details.price, details.status)
  })
  .catch((error) => {
    // ONE catch handles errors from ANY step in the chain
    console.log("Chain error:", error.message)
  })

/**
 * Compare to callback hell:
 *   Callbacks: right-ward drift, error handling repeated, unreadable
 *   Promises:  flat chain, ONE error handler, composable
 */


// ════════════════════════════════════════════════════════════
// PART 5 — PROMISE COMBINATORS
// Running multiple async operations together
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 5: Promise Combinators ════\n")

// Simulate API calls with different durations
const fetchUser    = () => new Promise(res => setTimeout(() => res({ id: 1, name: "Yoandy" }), 100))
const fetchConfig  = () => new Promise(res => setTimeout(() => res({ theme: "dark", lang: "es" }), 200))
const fetchPosts   = () => new Promise(res => setTimeout(() => res([{ id: 1, title: "Async JS" }]), 150))
const fetchFailing = () => new Promise((_, rej) => setTimeout(() => rej(new Error("API down")), 120))

// ── Promise.all() — ALL must succeed ─────────────────────
/**
 * Runs all promises in PARALLEL.
 * Resolves when ALL resolve. Rejects if ANY reject.
 * Use when: you need all results to proceed (and can't if any fail).
 * Real React example: load user + config + initial data simultaneously.
 */

Promise.all([fetchUser(), fetchConfig(), fetchPosts()])
  .then(([user, config, posts]) => {
    // Destructuring the results array — order matches input order
    console.log("Promise.all — all resolved:")
    console.log("  user:", user.name)
    console.log("  config:", config.theme)
    console.log("  posts:", posts.length, "posts")
  })
  .catch((error) => {
    console.log("Promise.all — one failed, all fail:", error.message)
  })

// One failure kills the whole thing:
Promise.all([fetchUser(), fetchFailing(), fetchPosts()])
  .then(() => console.log("Won't run"))
  .catch((e) => console.log("Promise.all with failure:", e.message)) // "API down"

// ── Promise.allSettled() — wait for ALL regardless ───────
/**
 * Runs all promises in PARALLEL.
 * Always resolves (never rejects) with array of {status, value|reason}.
 * Use when: you want all results even if some fail.
 * Real React example: batch updates where partial success is OK.
 */

Promise.allSettled([fetchUser(), fetchFailing(), fetchPosts()])
  .then((results) => {
    console.log("\nPromise.allSettled — all results:")
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        console.log(`  [${i}] fulfilled:`, r.value)
      } else {
        console.log(`  [${i}] rejected:`, r.reason.message)
      }
    })
  })

// ── Promise.race() — first one wins ──────────────────────
/**
 * Resolves/rejects with the FIRST settled promise (success OR failure).
 * Use when: timeout logic, fastest data source wins.
 */

const slowAPI    = new Promise(res => setTimeout(() => res("slow"), 500))
const fastAPI    = new Promise(res => setTimeout(() => res("fast"), 50))

Promise.race([slowAPI, fastAPI])
  .then((winner) => console.log("\nPromise.race winner:", winner)) // "fast"

// Timeout pattern with race:
const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`Timeout after ${ms}ms`)), ms))
  ])

withTimeout(new Promise(res => setTimeout(() => res("data"), 1000)), 300)
  .then(data => console.log("Got data:", data))
  .catch(e => console.log("Timeout pattern:", e.message)) // "Timeout after 300ms"

// ── Promise.any() — first SUCCESS wins ───────────────────
/**
 * Resolves with the FIRST fulfilled promise.
 * Only rejects if ALL reject (AggregateError).
 * Use when: multiple fallback sources, use whichever responds first.
 */

Promise.any([
  new Promise((_, rej) => setTimeout(() => rej(new Error("CDN 1 down")), 50)),
  new Promise(res => setTimeout(() => res("CDN 2 data"), 100)),
  new Promise(res => setTimeout(() => res("CDN 3 data"), 200)),
])
  .then(result => console.log("\nPromise.any first success:", result)) // CDN 2

/**
 * COMBINATOR SUMMARY:
 * ┌─────────────────┬──────────────────────────────────────┐
 * │ Promise.all()   │ ALL succeed → array of values        │
 * │                 │ ANY fail → immediate rejection        │
 * ├─────────────────┼──────────────────────────────────────┤
 * │ .allSettled()   │ ALL settle → array of {status,value} │
 * │                 │ Never rejects                        │
 * ├─────────────────┼──────────────────────────────────────┤
 * │ .race()         │ FIRST settles → that value or error  │
 * │                 │ Used for timeouts                    │
 * ├─────────────────┼──────────────────────────────────────┤
 * │ .any()          │ FIRST success → that value           │
 * │                 │ ALL fail → AggregateError            │
 * └─────────────────┴──────────────────────────────────────┘
 */


// ════════════════════════════════════════════════════════════
// PART 6 — async/await: Promises with Synchronous Syntax
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 6: async/await ════\n")

/**
 * async/await is NOT a new async model. It IS Promises.
 * It's syntactic sugar that lets you write async code that READS like sync code.
 *
 * RULES:
 * 1. `async` before a function → that function always returns a Promise
 * 2. `await` can ONLY be used inside an `async` function
 * 3. `await expression` pauses execution of THAT function until the Promise resolves
 *    — other code keeps running (it pauses the function, not the engine)
 */

// ── Basic async/await ────────────────────────────────────
const loadUser = async (userId) => {
  console.log("Fetching user...")
  const user = await getUserPromise(userId)  // pause here until resolved
  console.log("User loaded:", user.name)
  return user  // async function wraps this in Promise.resolve(user)
}

// async function returns a Promise — you still .then() it from outside
loadUser(1).then(u => console.log("Returned from async fn:", u.name))

// ── async/await vs Promise chain — same thing ─────────────
/**
 * These two are IDENTICAL in behavior:
 */

// Promise chain:
const getDataChain = () =>
  getUserPromise(1)
    .then(user => getOrdersPromise(user.id))
    .then(orders => getOrderDetailsPromise(orders[0].id))
    .then(details => details)

// async/await:
const getDataAsync = async () => {
  const user    = await getUserPromise(1)
  const orders  = await getOrdersPromise(user.id)
  const details = await getOrderDetailsPromise(orders[0].id)
  return details
}

// Both return a Promise<details>. The async/await version reads like synchronous code.

getDataAsync().then(d => console.log("\nasync/await chain result: $" + d.price))

// ── Sequential vs Parallel with await ────────────────────
console.log("\n── Sequential vs Parallel ──")

/**
 * MISTAKE: awaiting one-by-one when operations are independent
 * Each await BLOCKS until the previous finishes: 100 + 200 + 150 = 450ms total
 */
const loadSequential = async () => {
  const start = Date.now()
  const user   = await fetchUser()    // wait 100ms
  const config = await fetchConfig()  // wait 200ms more
  const posts  = await fetchPosts()   // wait 150ms more
  console.log(`Sequential: ${Date.now() - start}ms`) // ~450ms
  return { user, config, posts }
}

/**
 * CORRECT: when operations are independent, run them IN PARALLEL
 * All three start at the same time: max(100, 200, 150) = 200ms total
 */
const loadParallel = async () => {
  const start = Date.now()
  const [user, config, posts] = await Promise.all([
    fetchUser(),    // all three start NOW
    fetchConfig(),  // simultaneously
    fetchPosts()    // simultaneously
  ])
  console.log(`Parallel: ${Date.now() - start}ms`) // ~200ms
  return { user, config, posts }
}

loadSequential().then(() => {})
setTimeout(() => loadParallel().then(() => {}), 600)


// ════════════════════════════════════════════════════════════
// PART 7 — try/catch WITH async/await
// The correct error handling pattern
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 7: try/catch with async/await ════\n")

/**
 * With Promises: errors go to .catch()
 * With async/await: wrap in try/catch — works exactly like synchronous error handling
 *
 * This is one of the main benefits: familiar error handling syntax.
 */

// ── Basic try/catch ───────────────────────────────────────
const loadUserSafe = async (userId) => {
  try {
    const user = await getUserPromise(userId)
    console.log("Loaded:", user.name)
    return user
  } catch (error) {
    console.log("Error handled:", error.message)
    return null  // graceful fallback
  } finally {
    console.log("Finally — cleanup (always runs)")
  }
}

setTimeout(() => {
  loadUserSafe(1)   // succeeds
  loadUserSafe(-1)  // triggers catch
}, 1200)

// ── Handling different error types ───────────────────────
setTimeout(async () => {
  console.log("\n── Typed error handling ──")

  const riskyOperation = async (input) => {
    if (input === null) throw new TypeError("Input cannot be null")
    if (input < 0)     throw new RangeError("Input must be positive")
    if (input === 0)   throw new Error("Input cannot be zero")
    return await getUserPromise(input)
  }

  const testCases = [1, null, -5, 0]

  for (const input of testCases) {
    try {
      const result = await riskyOperation(input)
      console.log(`Input ${input} → success:`, result.name)
    } catch (error) {
      // Handle different error types differently:
      if (error instanceof TypeError) {
        console.log(`Input ${input} → TypeError:`, error.message)
      } else if (error instanceof RangeError) {
        console.log(`Input ${input} → RangeError:`, error.message)
      } else {
        console.log(`Input ${input} → Error:`, error.message)
      }
    }
  }
}, 2000)


// ════════════════════════════════════════════════════════════
// PART 8 — ASYNC/AWAIT + PROMISES MIXED PATTERNS
// Real-world scenarios you'll encounter constantly
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 8: Mixed Patterns ════\n")

// ── Pattern 1: await inside Promise.all ──────────────────
/**
 * Most common pattern in React: fetch multiple resources in parallel,
 * use async functions for each, combine with Promise.all
 */
const fetchUserData = async (id) => {
  const user   = await getUserPromise(id)
  const orders = await getOrdersPromise(user.id)
  return { user, orders }  // async fn returns Promise<{user, orders}>
}

const fetchAppConfig = async () => {
  const config = await fetchConfig()
  return { config, timestamp: Date.now() }
}

// Run both data loading pipelines in PARALLEL:
setTimeout(async () => {
  try {
    const [userData, appConfig] = await Promise.all([
      fetchUserData(1),    // async fn returns a Promise
      fetchAppConfig()     // async fn returns a Promise
    ])
    console.log("Mixed pattern result:")
    console.log("  user:", userData.user.name)
    console.log("  orders:", userData.orders.length)
    console.log("  theme:", appConfig.config.theme)
  } catch (error) {
    console.log("Mixed pattern error:", error.message)
  }
}, 2500)

// ── Pattern 2: Retry with async/await ────────────────────
/**
 * Retry a failing operation up to N times.
 * Real use case: flaky network, rate limits.
 */
const withRetry = async (fn, maxRetries = 3, delay = 100) => {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn()
      console.log(`Retry pattern: succeeded on attempt ${attempt}`)
      return result
    } catch (error) {
      lastError = error
      console.log(`Retry pattern: attempt ${attempt} failed — ${error.message}`)
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, delay * attempt)) // exponential backoff
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`)
}

// Simulate operation that fails twice then succeeds:
let callCount = 0
const flakyOperation = () => new Promise((resolve, reject) => {
  callCount++
  setTimeout(() => {
    if (callCount < 3) reject(new Error(`Attempt ${callCount} failed`))
    else resolve("finally succeeded")
  }, 50)
})

setTimeout(async () => {
  try {
    const result = await withRetry(flakyOperation, 3, 50)
    console.log("Retry result:", result)
  } catch (e) {
    console.log("All retries exhausted:", e.message)
  }
}, 3500)

// ── Pattern 3: Queue async operations ────────────────────
/**
 * Process items one at a time (not in parallel).
 * Real use case: API rate limiting, sequential file writes.
 */
const processQueue = async (items, processor) => {
  const results = []
  for (const item of items) {
    // await each one — sequential, not parallel
    const result = await processor(item)
    results.push(result)
  }
  return results
}

setTimeout(async () => {
  const ids = [1, 2, 3]
  const results = await processQueue(ids, getUserPromise)
  console.log("\nQueue processed:", results.map(u => u.name))
}, 4200)

// ── Pattern 4: Promise wrapping callbacks (promisify) ────
/**
 * When you encounter an old callback-style API, wrap it in a Promise.
 * This is what Node's util.promisify does internally.
 */
const promisify = (callbackFn) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      callbackFn(...args, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
}

const getUserAsync = promisify(getUserFromDB)  // wrap our callback fn

setTimeout(async () => {
  try {
    const user = await getUserAsync(1)
    console.log("\nPromisified callback:", user.name)
  } catch (e) {
    console.log("Promisify error:", e.message)
  }
}, 5000)


// ════════════════════════════════════════════════════════════
// PART 9 — MICROTASK vs MACROTASK QUEUE
// The most misunderstood part of the event loop
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 9: Execution Order ════\n")

/**
 * PRIORITY ORDER:
 * 1. Synchronous code (call stack)
 * 2. Microtask queue (Promises — .then(), .catch(), queueMicrotask())
 * 3. Macrotask queue (setTimeout, setInterval, I/O)
 *
 * After each macrotask, ALL microtasks are drained before the next macrotask.
 */

console.log("1 — sync")

setTimeout(() => console.log("4 — macrotask (setTimeout 0)"), 0)

Promise.resolve()
  .then(() => console.log("3 — microtask (Promise.then)"))
  .then(() => console.log("3b — microtask (chained then)"))

console.log("2 — sync")

// Output order: 1 → 2 → 3 → 3b → 4
// Sync first, then ALL microtasks, then macrotask

/**
 * WHY THIS MATTERS IN REACT:
 *
 * useState setters in React 18 are batched.
 * If you call setState inside a Promise .then(), it may or may not batch
 * depending on whether you're in a microtask or macrotask context.
 * Understanding the queue priority helps you debug unexpected re-renders.
 *
 * Also: await expressions resume as microtasks.
 * Everything AFTER an await in an async function runs as a microtask.
 */


// ════════════════════════════════════════════════════════════
// PART 10 — REAL REACT PATTERNS
// Everything above in the context you'll actually use it
// ════════════════════════════════════════════════════════════

console.log("\n\n════ PART 10: React Patterns (pseudo-code) ════\n")

/**
 * In React, async operations live primarily in:
 * 1. useEffect — data fetching on mount
 * 2. Event handlers — form submissions, button clicks
 * 3. Custom hooks — reusable async logic
 */

// ── Pattern: useEffect data fetching ─────────────────────
/**
 *
 * const UserProfile = ({ userId }) => {
 *   const [user, setUser] = useState(null)
 *   const [loading, setLoading] = useState(true)
 *   const [error, setError] = useState(null)
 *
 *   useEffect(() => {
 *     // useEffect callback cannot be async directly
 *     // Define async function inside and call it
 *
 *     const fetchUser = async () => {
 *       try {
 *         setLoading(true)
 *         const response = await fetch(`/api/users/${userId}`)
 *         if (!response.ok) throw new Error(`HTTP ${response.status}`)
 *         const data = await response.json()
 *         setUser(data)
 *       } catch (err) {
 *         setError(err.message)
 *       } finally {
 *         setLoading(false)     // always turn off spinner
 *       }
 *     }
 *
 *     fetchUser()
 *
 *     // Cleanup: abort the request if component unmounts
 *     return () => controller.abort()
 *
 *   }, [userId])
 *
 *   if (loading) return <Spinner />
 *   if (error)   return <ErrorMessage msg={error} />
 *   return <div>{user?.name}</div>
 * }
 *
 * KEY: useEffect callback is sync, async function is defined and called inside.
 * This is the correct React pattern — not async () => {} directly.
 */

// Simulate the React loading pattern in plain JS:
const simulateReactFetch = async (userId) => {
  let state = { user: null, loading: true, error: null }

  const render = (s) => {
    if (s.loading) return "Loading..."
    if (s.error)   return `Error: ${s.error}`
    return `User: ${s.user.name}`
  }

  console.log("Render 1:", render(state)) // Loading...

  try {
    const user = await getUserPromise(userId)
    state = { user, loading: false, error: null }
    console.log("Render 2:", render(state)) // User: Yoandy
  } catch (error) {
    state = { user: null, loading: false, error: error.message }
    console.log("Render 2:", render(state)) // Error: ...
  }
}

setTimeout(() => simulateReactFetch(1), 5500)
setTimeout(() => simulateReactFetch(-1), 6000)

// ── Pattern: Promise.all in useEffect ────────────────────
/**
 *
 * useEffect(() => {
 *   const loadDashboard = async () => {
 *     setLoading(true)
 *     try {
 *       const [user, posts, stats] = await Promise.all([
 *         fetch('/api/user').then(r => r.json()),
 *         fetch('/api/posts').then(r => r.json()),
 *         fetch('/api/stats').then(r => r.json()),
 *       ])
 *       setDashboardData({ user, posts, stats })
 *     } catch (err) {
 *       setError(err)
 *     } finally {
 *       setLoading(false)
 *     }
 *   }
 *   loadDashboard()
 * }, [])
 *
 * This loads all three resources in parallel — max(t1, t2, t3) not t1+t2+t3.
 * In real apps this can cut initial load time by 50-70%.
 */


// ════════════════════════════════════════════════════════════
// CHEATSHEET
// ════════════════════════════════════════════════════════════

const CHEATSHEET = `
┌────────────────────────────────────────────────────────────┐
│               ASYNC JAVASCRIPT CHEATSHEET                  │
├────────────────┬───────────────────────────────────────────┤
│ setTimeout     │ Run once after delay (macrotask)          │
│ setInterval    │ Run repeatedly (macrotask)                │
│ clearTimeout   │ Cancel a scheduled timeout                │
├────────────────┼───────────────────────────────────────────┤
│ new Promise()  │ Create a Promise manually                 │
│ .then()        │ Handle success                            │
│ .catch()       │ Handle failure                            │
│ .finally()     │ Always runs (cleanup)                     │
├────────────────┼───────────────────────────────────────────┤
│ Promise.all    │ ALL succeed → array. ANY fail → throws    │
│ .allSettled    │ ALL settle → [{status, value/reason}]     │
│ .race          │ FIRST settles (success or fail)           │
│ .any           │ FIRST success. ALL fail → AggregateError  │
├────────────────┼───────────────────────────────────────────┤
│ async fn       │ Always returns Promise                    │
│ await expr     │ Pause fn until Promise settles            │
│ try/catch      │ Error handling for async/await            │
│ try/finally    │ Cleanup regardless of success/failure     │
├────────────────┼───────────────────────────────────────────┤
│ Sequential     │ await one by one — use for dependent ops  │
│ Parallel       │ await Promise.all([...]) — independent ops│
├────────────────┼───────────────────────────────────────────┤
│ Microtask      │ Promise .then — runs BEFORE macrotasks    │
│ Macrotask      │ setTimeout — runs AFTER all microtasks    │
└────────────────┴───────────────────────────────────────────┘

GOLDEN RULES:
  1. Never await inside loops when operations are independent → use Promise.all
  2. Always handle errors — unhandled rejections crash Node.js
  3. useEffect callbacks cannot be async — define async fn inside and call it
  4. finally is your cleanup guarantee — use it for loading states, connections
  5. async/await IS Promises — understanding Promises means understanding async/await
`

setTimeout(() => console.log(CHEATSHEET), 6500)
