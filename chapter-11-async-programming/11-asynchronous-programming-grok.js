/**
 * Eloquent JavaScript - Chapter 11: Asynchronous Programming
 * Offline Study Guide + Practice
 * Run with: node chapter11-async-study.js
 */

console.log("=== Chapter 11: Asynchronous Programming ===\n")

// 1. Basic Callback Example
function delayedGreeting(name, callback) {
  setTimeout(() => {
    callback(`Hello ${name}!`)
  }, 800)
}

delayedGreeting("Senior Dev", (message) => {
  console.log(message)
})

// 2. Promises
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

delay(600).then(() => {
  console.log("Promise resolved after 600ms")
})

// Promise with reject
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    delay(400).then(() => {
      if (id > 0) resolve({ id, name: `User${id}` })
      else reject(new Error("Invalid user ID"))
    })
  })
}

// 3. Async / Await (Best Practice)
async function demoAsync() {
  console.log("Starting async demo...")

  try {
    const user = await fetchUser(42)
    console.log("User loaded:", user)

    await delay(300)
    console.log("Processing complete")

    return "All done!"
  } catch (err) {
    console.error("Error:", err.message)
  }
}

// Run the async function
demoAsync().then((result) => {
  console.log("Final result:", result)
})

// 4. Promise.all() - Parallel Execution
async function loadMultiple() {
  try {
    const results = await Promise.all([fetchUser(1), fetchUser(2), delay(500).then(() => "Extra data")])

    console.log("All loaded in parallel:", results)
  } catch (err) {
    console.error(err)
  }
}

loadMultiple()

// 5. Practical Real-World Example (Simulated API)
class API {
  static async getPost(id) {
    await delay(300)
    return { id, title: `Post #${id}`, body: "Content here..." }
  }

  static async getComments(postId) {
    await delay(250)
    return [`Comment 1 for post ${postId}`, `Comment 2 for post ${postId}`]
  }
}

async function loadPostWithComments(postId) {
  console.log(`\nLoading post ${postId}...`)
  const post = await API.getPost(postId)
  const comments = await API.getComments(postId)

  console.log("Post:", post)
  console.log("Comments:", comments)
  return { post, comments }
}

// Execute
loadPostWithComments(101)

console.log("\n=== Key Takeaways ===")
console.log("1. async/await is preferred for readability")
console.log("2. Always handle errors with .catch() or try/catch")
console.log("3. Use Promise.all() for performance (parallel requests)")
console.log("4. Understand the Event Loop: Call Stack → Microtasks → Macrotasks")
console.log("5. Avoid blocking the main thread")

// === Exercises from the Book ===
console.log("\n=== Exercises to Practice ===")
console.log("1. Rewrite the 'find the way' robot from Ch7 using async/await")
console.log("2. Implement a function that retries a promise N times")
console.log("3. Build a simple Promise-based HTTP request wrapper")
console.log("4. Compare callback, Promise, and async/await versions of the same flow")
