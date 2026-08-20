# Chapter 11: Asynchronous Programming Exercises

````markdown
_Practice Problems from Eloquent JavaScript_

## Exercise 11.1: Quiet Times

**Scenario**
There’s a security camera near Carla’s lab that’s activated by a motion sensor. It is connected to the network and starts sending out a video stream when it is active. Because she’d rather not be discovered, Carla has set up a system that notices this kind of wireless network traffic and turns on a light in her lair whenever there is activity outside, so she knows when to keep quiet.

She’s also been logging the times at which the camera is tripped for a while and wants to use this information to visualize which times, in an average week, tend to be quiet and which tend to be busy.

**The Data**
The log is stored in files holding one timestamp number (as returned by `Date.now()`) per line.
Example log content:

```text
1695709940692
1695701068331
1695701189163
```
````

The file `camera_logs.txt` holds a list of these logfilenames (one filename per line).

**The Task**
[x] Write an asynchronous function `activityTable(day)` that:

1. Takes a day of the week as an argument (0 for Sunday, 6 for Saturday, matching `Date.getDay()`).
2. Reads the `camera_logs.txt` file to get a list of log filenames.
3. Reads each of those logfiles.
4. Returns an array of 24 numbers (one for each hour of the day), where each number represents the count of camera observations for that specific hour on the given day.

**Tools Available**

- `textFile(filename)`: Returns a Promise that resolves to the file content (string).
- `new Date(timestamp)`: Creates a Date object from a timestamp.
- `date.getDay()`: Returns the day of the week (0-6).
- `date.getHours()`: Returns the hour (0-23).
- `activityGraph(table)`: A provided function that converts the resulting array into a visual string.

**Starter Code**

```javascript
async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt")
  // Your code here
  // 1. Parse the list of filenames from logFileList
  // 2. Read all the log files
  // 3. Process the timestamps and count activity per hour
  // 4. Return the array of 24 numbers
}

activityTable(1).then((table) => console.log(activityGraph(table)))
```

---

## Exercise 11.2: Real Promises

**The Task**
[x] Rewrite the `activityTable` function from the previous exercise **without** using `async/await`. Instead, use plain Promise methods (like `.then()` and `Promise.all`).

**Starter Code**

```javascript
function activityTable(day) {
  // Your code here
  // Use Promise.all and .then() chains
}

activityTable(6).then((table) => console.log(activityGraph(table)))
```

**Discussion Questions**

1. In the async function, using `await` in a loop is simpler. In the Promise version, `Promise.all` is more convenient. If reading a file takes some time, which of these two approaches (sequential `await` in a loop vs. `Promise.all`) will take the least time to run? Why?
   R/ Promise.all executes all file at same time and resolves when all promises are resolved.
2. If one of the files listed in the file list has a typo, and reading it fails, how does that failure end up in the Promise object that your function returns?
   R/ End in the reject as new Error

---

## Exercise 11.3: Building Promise.all

**The Task**
[x] Implement your own version of `Promise.all` as a regular function called `Promise_all`.

**Requirements**

- It takes an array of promises as an argument.
- It returns a new Promise.
- When all input promises succeed, the returned Promise resolves with an array of results (in the same order as the input).
- If **any** promise in the array fails, the returned Promise should immediately reject with the failure reason of that first failing promise.
- Remember: Once a promise succeeds or fails, it cannot change state.

**Starter Code**

```javascript
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
    // Handle empty array case
    // Track results and remaining promises
    // Handle success of individual promises
    // Handle failure of any individual promise
  })
}

// Test code provided by the sandbox
Promise_all([]).then((array) => {
  console.log("This should be []:", array)
})

function soon(val) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), Math.random() * 500)
  })
}

Promise_all([soon(1), soon(2), soon(3)]).then((array) => {
  console.log("This should be [1, 2, 3]:", array)
})

Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then((array) => {
    console.log("We should not get here")
  })
  .catch((error) => {
    if (error != "X") {
      console.log("Unexpected failure:", error)
    }
  })
```

```

```
