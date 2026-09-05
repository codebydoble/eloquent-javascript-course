# Chapter 11 Async — Challenge Exam

**Exercises:** 10  
**Total:** 100 points  
**Difficulty:** Intermediate → Advanced  
**Environment:** Node.js / VSCode

## Rules

Before each exercise define:

1. Base case
2. Success condition
3. Failure condition
4. Sequential or concurrent execution
5. Output-order invariant

---

## 1. Normalize Async Results

[x] Implement `normalizeResults(values)`.

Input may contain ordinary values and Promises.

Requirements:

- `[]` resolves to `[]`
- run Promises concurrently
- preserve input order
- preserve original rejection reason
- do not use `Promise.all()`

Example:

```js
;[delayResolve("slow", 100), "ordinary", delayResolve("fast", 10)]
```

Expected:

```js
;["slow", "ordinary", "fast"]
```

---

## 2. Sequential Pipeline

[x] Implement `pipeline(steps, initialValue)`.

Requirements:

- each step receives the previous result
- execute strictly sequentially
- `[]` returns `initialValue`
- stop immediately on rejection
- preserve original rejection reason

Example:

```js
await pipeline(
  [(value) => Promise.resolve(value + 2), (value) => Promise.resolve(value * 3), (value) => Promise.resolve(value - 1)],
  4,
)
```

Expected:

```js
17
```

---

## 3. Concurrent Mapping with Stable Order

[] Implement `asyncMap(items, mapper)`.

Requirements:

- start all mapper calls concurrently
- preserve input order
- `[] -> []`
- do not mutate input
- do not use `Promise.all()`

Expected:

```js
;["A0", "B1", "C2"]
```

---

## 4. Timeout Wrapper

[x] Implement `withTimeout(promise, milliseconds)`.

Requirements:

- resolve with original result if Promise settles first
- reject with `Error("Timeout")` if timer wins
- preserve original rejection reason
- `milliseconds === 0` is valid
- negative milliseconds reject with `RangeError`
- clean up unnecessary timers

Tests:

```js
await withTimeout(delayResolve("OK", 50), 100)
// "OK"

await withTimeout(delayResolve("OK", 100), 50)
// Error("Timeout")
```

---

## 5. Retry

[x] Implement `retry(operation, attempts)`.

Requirements:

- attempts are maximum total executions
- retries are sequential
- stop immediately after success
- attempts `1` means execute once
- attempts `0` must not execute operation
- negative attempts reject with `RangeError`
- final failure rejects with final error

Test:

```js
let calls = 0
const flaky = () => {
  calls++
  return calls < 3 ? Promise.reject("temporary") : Promise.resolve("success")
}
```

Expected:

```js
await retry(flaky, 3)
// "success"

calls
// 3
```

---

## 6. First Successful Result

[x] Implement `firstSuccess(values)`.

Requirements:

- start all inputs concurrently
- resolve with first fulfilled value
- ordinary values allowed
- if all reject, reject with reasons in input order
- `[]` rejects with `[]`
- do not use `Promise.any()`

Example:

```js
;[delayReject("A", 100), delayResolve("B", 200), delayResolve("C", 300)]
```

Expected:

```js
"B"
```

---

## 7. Concurrency Limit

[x] Implement `runWithLimit(tasks, limit)`.

Requirements:

- at most `limit` tasks running simultaneously
- preserve input order
- `[] -> []`
- positive integer limit required
- each task executes once
- preserve rejection reason
- do not start additional tasks after rejection

Example:

```js
await runWithLimit(
  [() => delayResolve("A", 100), () => delayResolve("B", 50), () => delayResolve("C", 30), () => delayResolve("D", 20)],
  2,
)
```

Expected:

```js
;["A", "B", "C", "D"]
```

---

## 8. Async Queue

[x] Implement `processQueue(items, worker)`.

Requirements:

- process strictly sequentially
- worker receives `(item, index)`
- `[] -> []`
- stop immediately after rejection
- do not start next worker after failure

Example:

```js
await processQueue([2, 4, 6], (value) => Promise.resolve(value / 2))
```

Expected:

```js
;[1, 2, 3]
```

---

## 9. Cancellation Token

[x] Implement `cancellableDelay(value, delay, token)`.

Token:

```js
{
  cancelled: false
}
```

Requirements:

- check cancellation before scheduling
- check cancellation before resolving
- cancellation rejects with `Error("Cancelled")`
- negative delay rejects with `RangeError`

Test:

```js
const token = { cancelled: false }
const promise = cancellableDelay("done", 100, token)

setTimeout(() => {
  token.cancelled = true
}, 20)
```

Expected rejection:

```text
Error("Cancelled")
```

---

## 10. Async Batch Runner

[x] Implement `runBatches(tasks, batchSize)`.

Requirements:

- tasks inside a batch start concurrently
- next batch starts only after current batch succeeds
- preserve global input order
- `[] -> []`
- positive integer batch size required
- reject with original reason on failure
- do not start next batch after failure
- each task executes exactly once
- do not use `Promise.all()`

Example execution with `[A, B, C, D, E]` and batch size `2`:

```text
Batch 1: A + B concurrently
wait
Batch 2: C + D concurrently
wait
Batch 3: E
```

Expected:

```js
;["A", "B", "C", "D", "E"]
```

---

# Final Checklist

- [ ] Empty input handled
- [ ] Every Promise path settles
- [ ] Sequential work is truly sequential
- [ ] Concurrent work is truly concurrent
- [ ] Input order is preserved where required
- [ ] Rejection reasons are preserved
- [ ] Retries stop after success
- [ ] Tasks execute exactly once
- [ ] No new work starts after terminal failure

## Pre-Code Template

```text
BASE CASE:
SUCCESS CONDITION:
FAILURE CONDITION:
EXECUTION MODEL:
ORDER INVARIANT:
```
