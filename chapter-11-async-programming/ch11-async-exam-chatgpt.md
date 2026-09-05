# Eloquent JavaScript — Chapter 11 Exam

## Asynchronous Programming

**Exercises:** 10  
**Total:** 100 points  
**Suggested time:** 120 minutes  
**Level:** Intermediate → Advanced Intermediate

> **Purpose:** This exam is designed to measure asynchronous reasoning, not memorization.
>
> The exercises deliberately target the mistake patterns from the previous Chapter 11 review: empty-input behavior, local time vs UTC, sequential vs concurrent execution, preserving Promise result order, and preserving rejection reasons.

---

# Exam Rules

## General Requirements

- Use modern JavaScript.
- Use Node.js-compatible JavaScript.
- Do not use external libraries.
- Keep the required function names and parameter order.
- Do not hard-code expected answers for the provided examples.
- Handle every edge case stated in each exercise.
- Test your code with every test case before considering the exercise complete.
- A solution that works only for the happy path is incomplete.

## Important Rule About Base Cases

Before writing recursive or repeated asynchronous logic, explicitly identify:

1. What is the normal case?
2. What is the success case?
3. What is the failure case?
4. What is the empty case?
5. What is the terminating/base case?

Several exercises intentionally include empty input or boundary values because these are common sources of hidden bugs.

---

# Exercise 1 — Async File Activity Table

**10 points**

## Objective

[x] Create an asynchronous function that receives a day of the week and returns an array of **24 hourly activity counts** based on timestamp data.

The goal is to practice:

- `async/await`
- asynchronous data processing
- parsing timestamps
- filtering
- reducing into a fixed structure
- handling empty results

## Input

Implement:

```javascript
async function activityTable(day)
```

Where:

```text
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

Use this simulated asynchronous file reader:

```javascript
const logData = [
  1727265600000, 1727272800000, 1727294400000, 1727283600000, 1727098800000, 1727102400000, 1727113200000, 1727120400000,
]

function textFile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(logData.join("\\n")), 50)
  })
}
```

## Requirements

- `activityTable(day)` must return a Promise.
- Use `async/await`.
- The result must always contain exactly **24 numbers**.
- Hour `0` belongs to index `0` and hour `23` to index `23`.
- Use local time with `date.getDay()` and `date.getHours()`.
- If no timestamps match the requested day, return 24 zeroes.
- Do not return an object when there are no matches.

## Expected Output

The result shape must always be:

```javascript
;[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

with matching hour buckets incremented.

## Test Cases

### Test 1 — Result shape

```javascript
const result = await activityTable(1)
Array.isArray(result)
```

Expected:

```text
true
```

### Test 2 — Exactly 24 positions

```javascript
result.length
```

Expected:

```text
24
```

### Test 3 — Empty day

Choose a day for which the dataset contains no entries.

Expected:

```text
24 zeroes
```

### Test 4 — No NaN

```javascript
result.some(Number.isNaN)
```

Expected:

```text
false
```

### Test 5 — Invalid day

Test:

```javascript
await activityTable(7)
```

Recommended documented behavior:

```text
return 24 zeroes
```

### Concept Evaluated

**`async/await`, asynchronous data processing, fixed-shape results, empty-input handling, and local time semantics.**

---

# Exercise 2 — Same Problem with a Promise Chain

**10 points**

## Objective

[x] Implement the same activity-table problem from Exercise 1, but using **Promises and `.then()`** instead of `async/await`.

## Input

Implement:

```javascript
function activityTablePromise(day)
```

Use the same `textFile()` and timestamp dataset from Exercise 1.

## Requirements

- Return a Promise.
- Do not use `async`.
- Do not use `await`.
- Use `.then()`.
- Use `.catch()` for failures.
- Return exactly 24 hourly counts.
- Preserve the same local-time rules from Exercise 1.
- Empty matching data must still return an array of 24 zeroes.
- Do not accidentally return the reducer's accumulator object.
- Do not put `Object.values()` only inside a branch that may never execute.

## Expected Output

The result must satisfy:

```javascript
Array.isArray(result) === true
result.length === 24
```

## Test Cases

### Test 1 — Existing day

```javascript
const result = await activityTablePromise(1)
```

Expected:

```text
Array.isArray(result) === true
result.length === 24
```

### Test 2 — Empty day

Expected:

```text
24 zeroes
```

### Test 3 — Rejection handling

Temporarily make `textFile()` reject.

Expected:

```text
activityTablePromise() rejects or returns the documented fallback
```

The behavior must be deliberate, not accidental.

### Concept Evaluated

**Promise chaining, `.catch()`, fixed-shape results, and empty-result handling.**

---

# Exercise 3 — Sequential vs Concurrent File Reads

**10 points**

## Objective

[x] Given multiple asynchronous file reads, implement both:

1. a sequential version;
2. a concurrent version.

Then compare their execution times.

## Input

Use:

```javascript
function textFile(filename) {
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
```

Implement:

```javascript
async function readSequential(files)
async function readConcurrent(files)
```

## Requirements

### `readSequential(files)`

- Read files one at a time.
- The next read cannot start until the previous read finishes.
- Preserve input order.

### `readConcurrent(files)`

- Start all reads without waiting for the previous one.
- Use `Promise.all()`.
- Preserve input order.

### Both

- Return an array of results.
- Return `[]` for empty input.
- Do not mutate the input array.

## Example Data

```javascript
;["a.txt", "b.txt", "c.txt"]
```

## Expected Output

Both functions must return:

```javascript
;["A.TXT", "B.TXT", "C.TXT"]
```

But their execution times should differ.

## Test Cases

### Test 1 — Sequential result

```javascript
await readSequential(["a.txt", "b.txt", "c.txt"])
```

Expected:

```javascript
;["A.TXT", "B.TXT", "C.TXT"]
```

Approximate time:

```text
450 ms
```

### Test 2 — Concurrent result

```javascript
await readConcurrent(["a.txt", "b.txt", "c.txt"])
```

Expected:

```javascript
;["A.TXT", "B.TXT", "C.TXT"]
```

Approximate time:

```text
200 ms
```

### Test 3 — Empty input

```javascript
await readConcurrent([])
```

Expected:

```javascript
;[]
```

### Concept Evaluated

**Sequential vs concurrent asynchronous execution and why `Promise.all()` can reduce waiting time.**

---

# Exercise 4 — Promise Order vs Resolution Order

**10 points**

## Objective

[x] Create a function that runs asynchronous operations concurrently while preserving the **original input order** in the returned result.

## Input

Implement:

```javascript
function collectInOrder(promises)
```

## Example Data

```javascript
const promises = [
  new Promise((resolve) => setTimeout(() => resolve(1), 300)),
  new Promise((resolve) => setTimeout(() => resolve(2), 100)),
  new Promise((resolve) => setTimeout(() => resolve(3), 200)),
]
```

## Requirements

- Start all Promises concurrently.
- The returned Promise must fulfill with:

```javascript
;[1, 2, 3]
```

- Do not use `result.push(value)` to determine final result position.
- Resolution order is intentionally:

```text
2 → 3 → 1
```

- Result order must remain:

```text
1 → 2 → 3
```

## Expected Output

```javascript
;[1, 2, 3]
```

## Test Cases

### Test 1 — Fixed timing

```javascript
collectInOrder(promises)
```

Expected:

```javascript
;[1, 2, 3]
```

### Test 2 — Different timing

```javascript
;[delayResolve("A", 300), delayResolve("B", 10), delayResolve("C", 150)]
```

Expected:

```javascript
;["A", "B", "C"]
```

### Test 3 — Reverse timing

```javascript
;[delayResolve("first", 1), delayResolve("second", 300), delayResolve("third", 1)]
```

Expected:

```javascript
;["first", "second", "third"]
```

### Concept Evaluated

**Concurrency, index-based result placement, closures, deterministic output, and race-condition avoidance.**

---

# Exercise 5 — Implement `Promise_all`

**10 points**

## Objective

[x] Implement a simplified version of native `Promise.all()`.

## Input

```javascript
function Promise_all(promises)
```

`promises` may contain:

- Promises;
- ordinary values.

## Requirements

Your implementation must:

1. return a new Promise;
2. resolve when every input item resolves;
3. preserve input order;
4. reject when any input rejects;
5. preserve the original rejection reason;
6. resolve `[]` for an empty input;
7. accept non-Promise values;
8. not use native `Promise.all()` internally.

## Example Data

```javascript
Promise_all([Promise.resolve("A"), Promise.resolve("B"), Promise.resolve("C")])
```

Expected:

```javascript
;["A", "B", "C"]
```

## Test Cases

### Test 1 — Empty array

```javascript
await Promise_all([])
```

Expected:

```javascript
;[]
```

### Test 2 — Different completion times

```javascript
await Promise_all([delayResolve(1, 300), delayResolve(2, 100), delayResolve(3, 200)])
```

Expected:

```javascript
;[1, 2, 3]
```

### Test 3 — Non-Promise values

```javascript
await Promise_all([1, Promise.resolve(2), 3])
```

Expected:

```javascript
;[1, 2, 3]
```

### Test 4 — Rejection reason

```javascript
await Promise_all([Promise.resolve("A"), Promise.reject("X"), Promise.resolve("C")])
```

Expected:

```text
rejects with exactly "X"
```

Not:

```text
"Rejected X"
```

### Test 5 — Multiple rejections

```javascript
await Promise_all([Promise.reject("first"), Promise.reject("second")])
```

Expected:

```text
returned Promise rejects
```

The rejection reason must be the reason from the rejection that reaches the implementation first.

### Test 6 — Exact order proof

```javascript
await Promise_all([delayResolve("slow", 300), delayResolve("fast", 50), delayResolve("middle", 150)])
```

Expected:

```javascript
;["slow", "fast", "middle"]
```

### Concept Evaluated

**Promise coordination, indexing, completion counting, empty-array handling, non-Promise values, rejection propagation, and race safety.**

---

# Exercise 6 — Async Error Propagation

**10 points**

## Objective

[x] Build an asynchronous pipeline where an error can originate in one operation and must reach the caller correctly.

## Input

Implement:

```javascript
function loadUser(id)
function loadOrders(userId)
async function getUserOrders(id)
```

## Example Data

Users:

```javascript
const users = {
  1: { id: 1, name: "Ada" },
  2: { id: 2, name: "Linus" },
}
```

Orders:

```javascript
const orders = {
  1: ["order-101", "order-102"],
  2: [],
}
```

## Rules

`loadUser(id)`:

- waits 50ms;
- resolves with the user if found;
- rejects with exactly `"User not found"` if missing.

`loadOrders(userId)`:

- waits 50ms;
- resolves with that user's orders;
- rejects if the user has no order record.

`getUserOrders(id)`:

- uses `async/await`;
- calls both functions in sequence;
- catches errors;
- rethrows the **same rejection reason** to the caller.

## Requirements

- Do not create a new unrelated error message in the catch block.
- The original rejection reason must remain observable.
- Do not call `loadOrders()` if `loadUser()` fails.
- `getUserOrders()` must return a Promise.

## Expected Output

For:

```javascript
await getUserOrders(1)
```

Expected:

```javascript
{
  user: { id: 1, name: "Ada" },
  orders: ["order-101", "order-102"]
}
```

For:

```javascript
await getUserOrders(99)
```

Expected rejection:

```text
"User not found"
```

## Test Cases

### Test 1

```javascript
await getUserOrders(1)
```

Expected successful result.

### Test 2

```javascript
await getUserOrders(2)
```

Expected:

```javascript
{
  user: { id: 2, name: "Linus" },
  orders: []
}
```

### Test 3

```javascript
await getUserOrders(99)
```

Expected:

```text
rejects with exactly "User not found"
```

### Concept Evaluated

**Async error propagation, `try/catch`, sequencing, and preserving rejection semantics.**

---

# Exercise 7 — Event Loop Prediction

**10 points**

## Objective

[x] Predict the exact output order of synchronous code, microtasks, and timer callbacks.

## Input

Run exactly this code:

```javascript
console.log("start")

setTimeout(() => {
  console.log("timeout-1")
}, 0)

Promise.resolve().then(() => {
  console.log("promise-1")

  queueMicrotask(() => {
    console.log("microtask-inside-promise")
  })
})

setTimeout(() => {
  console.log("timeout-2")
}, 0)

console.log("end")
```

## Requirements

Before executing:

- write the expected order;
- identify synchronous code;
- identify microtasks;
- identify timer callbacks;
- explain why `promise-1` does not execute immediately;
- explain why the nested microtask runs before the timers.

## Expected Output

```text
start
end
promise-1
microtask-inside-promise
timeout-1
timeout-2
```

## Test Cases

### Test 1

First line:

```text
start
```

### Test 2

Second line:

```text
end
```

### Test 3

Both microtasks complete before the timers:

```text
promise-1
microtask-inside-promise
timeout-1
timeout-2
```

### Concept Evaluated

**Call stack, Promise microtasks, `queueMicrotask`, timers, and event-loop scheduling.**

---

# Exercise 8 — Fix the Empty-Input / Base-Case Bug

**10 points**

## Objective

[x] Correct a reduction algorithm that works for non-empty input but fails when there are no matching timestamps.

## Input

You are given:

```javascript
function countHours(timestamps, day) {
  const filtered = timestamps.map((ts) => new Date(ts)).filter((date) => date.getDay() === day)

  return filtered.reduce(
    (acc, date, index) => {
      const hour = date.getHours()

      acc[hour]++

      if (index === filtered.length - 1) {
        return Object.values(acc)
      }

      return acc
    },
    {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0,
    },
  )
}
```

## Requirements

Fix the function without changing its external signature.

Correct contract:

```javascript
countHours(timestamps, day)
→ Number[24]
```

Rules:

- Always return an array.
- Always return exactly 24 values.
- Empty `filtered` input must still produce 24 zeroes.
- Do not return the accumulator object.
- Use `Object.values()` only after accumulation is complete.
- Preserve `getHours()`.

## Expected Output

For no matching timestamps:

```javascript
;[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

## Test Cases

### Test 1 — Empty input

```javascript
countHours([], 1)
```

Expected:

```text
Array.isArray(result) === true
result.length === 24
```

### Test 2 — Non-empty input

Expected:

```text
array of 24 numbers
```

### Test 3 — One matching timestamp

Exactly one hourly bucket should contain `1`.

Total sum:

```text
1
```

### Test 4 — No NaN

```javascript
result.some(Number.isNaN)
```

Expected:

```text
false
```

### Concept Evaluated

**Base cases, accumulator design, empty reductions, fixed-shape outputs, and avoiding conditional return logic inside `reduce()`.**

---

# Exercise 9 — Retry with an Explicit Base Case

**10 points**

## Objective

[x] Implement a retry mechanism for an asynchronous operation.

This exercise intentionally tests whether you can define a correct **base case** before writing recursive asynchronous code.

## Input

Implement:

```javascript
function retry(operation, attempts)
```

Where:

- `operation`: function returning a Promise;
- `attempts`: maximum number of executions.

## Example Data

### Always successful

```javascript
const success = () => Promise.resolve("OK")
```

### Always failing

```javascript
const failure = () => Promise.reject(new Error("FAILED"))
```

### Fails twice, then succeeds

```javascript
let calls = 0

const flaky = () => {
  calls++

  if (calls < 3) {
    return Promise.reject(new Error("Temporary failure"))
  }

  return Promise.resolve("OK")
}
```

## Requirements

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

## Expected Output

### Success

```javascript
await retry(success, 3)
```

Expected:

```text
OK
```

### Failure

```javascript
await retry(failure, 3)
```

Expected:

```text
rejects with Error("FAILED")
```

### Flaky operation

```javascript
await retry(flaky, 3)
```

Expected:

```text
OK
```

and:

```text
calls === 3
```

## Test Cases

### Test 1 — One attempt

```javascript
retry(failure, 1)
```

Expected:

```text
operation called once
Promise rejected
```

### Test 2 — Zero attempts

```javascript
retry(success, 0)
```

Expected:

```text
operation never called
```

### Test 3 — Negative attempts

```javascript
retry(success, -1)
```

Expected:

```text
invalid input
operation never called
```

### Test 4 — Success on second attempt

Expected:

```text
2 calls maximum
final result === "OK"
```

### Test 5 — Success on first attempt

Expected:

```text
1 call
no additional retries
```

### Concept Evaluated

**Promise recursion, explicit base cases, termination, retry limits, and off-by-one correctness.**

---

# Exercise 10 — Build a Small Async Task Runner

**10 points**

## Objective

[x] Build a small asynchronous task runner that executes independent tasks concurrently, preserves task order in the final output, and rejects when a task fails.

This is the final synthesis exercise.

## Input

Implement:

```javascript
function runTasks(tasks)
```

Each task is a function that returns a Promise:

```javascript
;[() => Promise, () => Promise, () => Promise]
```

## Example Data

```javascript
const tasks = [() => delayResolve("first", 300), () => delayResolve("second", 100), () => delayResolve("third", 200)]
```

## Requirements

- Start all tasks concurrently.
- Do not call the second task only after the first has completed.
- Preserve task order in the final result.
- If all tasks succeed, resolve with an array of results.
- If any task rejects, reject with the original rejection reason.
- Empty task array must resolve to `[]`.
- Do not use native `Promise.all()`.

## Expected Output

```javascript
await runTasks(tasks)
```

Expected:

```javascript
;["first", "second", "third"]
```

Even though the resolution order is:

```text
second → third → first
```

## Test Cases

### Test 1 — All succeed

```javascript
await runTasks([() => delayResolve("A", 50), () => delayResolve("B", 10), () => delayResolve("C", 30)])
```

Expected:

```javascript
;["A", "B", "C"]
```

### Test 2 — Empty array

```javascript
await runTasks([])
```

Expected:

```javascript
;[]
```

### Test 3 — One failure

```javascript
await runTasks([() => delayResolve("A", 50), () => Promise.reject("ERROR"), () => delayResolve("C", 10)])
```

Expected:

```text
Promise rejected with exactly "ERROR"
```

### Test 4 — Concurrency

```javascript
;[() => delayResolve("A", 300), () => delayResolve("B", 100), () => delayResolve("C", 200)]
```

Expected total time approximately:

```text
300 ms
```

not:

```text
600 ms
```

### Test 5 — Order guarantee

Force completion order:

```text
B → C → A
```

Expected result:

```text
A → B → C
```

### Concept Evaluated

**Concurrency, Promise coordination, result indexing, rejection propagation, empty-input handling, and race-condition prevention.**

---

# Final Submission Checklist

Before submitting, verify:

- [ ] All 10 exercises are implemented.
- [ ] All required function names are preserved.
- [ ] All required parameters are preserved.
- [ ] Every function returns the required type.
- [ ] Happy-path tests pass.
- [ ] Empty-input tests pass.
- [ ] Boundary values pass.
- [ ] Base cases are explicitly handled.
- [ ] No off-by-one retry bug exists.
- [ ] Promise results preserve **input order**, not resolution order.
- [ ] Rejection reasons are preserved exactly when required.
- [ ] Local-time requirements use `getHours()` / `getDay()` where specified.
- [ ] UTC methods are not introduced without a timezone requirement.
- [ ] Sequential work is actually sequential.
- [ ] Concurrent work is actually concurrent.
- [ ] Shared mutable state is not updated incorrectly across asynchronous gaps.
- [ ] Empty `reduce()` cases have been considered.
- [ ] Tests are deterministic where order matters.

---

# Scoring Rubric

| Score    | Interpretation                                                                          |
| -------- | --------------------------------------------------------------------------------------- |
| 90–100   | Strong mastery. You reason about async behavior and edge cases reliably.                |
| 80–89    | Good command. A few implementation or edge-case mistakes remain.                        |
| 70–79    | Functional understanding, but hidden cases can still expose important gaps.             |
| 60–69    | You understand several concepts but need stronger control of async flow and edge cases. |
| Below 60 | Revisit Promise behavior, async control flow, and systematic test design.               |

## Important

A score is evidence about **current performance**, not about your capacity.

This exam is intentionally constructed around the exact areas where previous solutions failed. The goal is not to avoid mistakes; it is to make the mistakes visible enough that you can learn the underlying rule.

A particularly important habit for this exam is:

> **Before coding, write the invariant and the base case.**

Examples:

```text
Empty input → []
```

```text
N tasks completed → resolve only when N === total
```

```text
Result position → input index, not completion order
```

```text
No attempts remaining → stop and reject
```

```text
No matching timestamps → 24 zeroes
```

These invariants are more valuable than memorizing individual fixes.
