/**
 * Chapter 11 Asynchronous Programming
 * Author: Yoandy Doble Herrera
 * Date: 18/07/2026
 */
"use strict"

import { readFile } from "fs"

console.log(`\n # Exercise 11.1: Quiet Times \n`)

/**
 * Funtion that read a file and return content Promise.
 * @param {String} filename any file.
 * @returns {Promise} return content if valid filename.
 */
function textFile(filename) {
  return new Promise((resolve, reject) => {
    //Code provided not work to upload txt
    /*readFile(filename, "utf8", (error, content) => {
      if (error) {
        reject(error)
      } else {
        resolve(content)
      }
    })*/
    let content =
      "1727265600000\n1727272800000\n1727294400000\n1727283600000\n1727098800000\n1727102400000\n1727113200000\n1727120400000\n1727138400000\n1695709940692\n1695701068331\n1727308800000\n1786346710025\n1777681510025\n1787055910025\n1695701189163\n"
    if (typeof filename !== "string" || filename === "") {
      reject(new Error(`Error: ENOENT: no such file or directory, open '${filename}'`))
    } else {
      resolve(content)
    }
  })
}

/**
 * Function that takes a day of the week as an argument (0 for Sunday, 6 for Saturday, matching `Date.getDay()`). Reads the `camera_logs.txt` file to get a list of log filenames. Reads each of those logfiles.
 * @param {Number} day a day of the week.
 * @returns {Promise} Returns an array of 24 numbers (one for each hour of the day), where each number represents the count of camera observations for that specific hour on the given day.
 */
const activityTable = async (day) => {
  try {
    const logFileList = await textFile("camera_logs_1.txt")
    // 1- Read filenames convert into array.
    const fileNames = logFileList.trim().split("\n")

    // 2- Creates a Date object from a timestamp and filter by day.
    const timestamps = [...fileNames]
      .map((timestamp) => new Date(Number(timestamp)))
      .filter((timestamp) => timestamp.getDay() === day)

    // 3. Process the timestamps and count activity per hour
    return timestamps.reduce(
      (activity, timestamp, currenIndex, arr) => {
        let key = timestamp.getUTCHours().toString()
        activity[key] = activity[key] + 1
        if (currenIndex === arr.length - 1) {
          return Object.values(activity)
        }
        return activity
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
  } catch (error) {
    console.log("Error: ", error)
    return
  }
}

/**
 * Function that convert a number activity array into ASCII bars graphic.
 * @param {Number[]} table an array of 24 numbers.
 * @returns {String} a visual representation from table (ASCII bars graphic)
 */
const activityGraph = (table) => {
  const max = Math.max(...table)
  // Escala para que el mayor valor tenga, por ejemplo, 40 caracteres de ancho
  const scale = 40 / (max || 1)

  let result = `Actividad Semanal (Día ${table.length}-Día simulado):\n`

  // Iterar sobre las 24 horas
  for (let h = 0; h < 24; h++) {
    const count = table[h]
    // Calcular el ancho de la barra
    const width = Math.round(count * scale)
    const bar = "#".repeat(width)

    // Formatear la hora con dos dígitos (08, 09, etc.)
    const hourStr = h < 10 ? `0${h}` : `${h}`

    result += `${hourStr}: ${bar} (${count})\n`
  }

  return result
}

activityTable(1).then((table) => console.log(activityGraph(table)))
activityTable(2).then((table) => console.log(activityGraph(table)))
activityTable(3).then((table) => console.log(activityGraph(table)))

console.log(`\n # Exercise 11.2: Real Promises \n`)

/**
 *  Rewrite the `activityTable` function from the previous exercise **without** using `async/await`. Instead, use plain Promise methods (like `.then()` and `Promise.all`).
 * Function that takes a day of the week as an argument (0 for Sunday, 6 for Saturday, matching `Date.getDay()`). Reads the `camera_logs.txt` file to get a list of log filenames. Reads each of those logfiles.
 * @param {Number} day a day of the week.
 * @returns {Promise} Returns an array of 24 numbers (one for each hour of the day), where each number represents the count of camera observations for that specific hour on the given day.
 */
const activityTable2 = (day) => {
  return Promise.all([textFile("camera_logs_1.txt")])
    .then(([camera1]) => {
      return [camera1].join().trim().split("\n")
    })
    .then((content) => {
      return content
        .map((timestamp) => new Date(Number(timestamp)))
        .filter((timestamp) => timestamp.getDay() === day)
        .reduce(
          (activity, timestamp, currenIndex, arr) => {
            let key = timestamp.getUTCHours().toString()
            activity[key] = activity[key] + 1
            if (currenIndex === arr.length - 1) {
              return Object.values(activity)
            }
            return activity
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
    })
    .catch((error) => {
      console.log("Error: ", error)
      return
    })
}

activityTable2(1).then((table) => console.log(activityGraph(table)))

console.log(`\n # Exercise 11.3: Building Promise.all \n`)

/**
 * Function personal Promise.all implementation.
 * - It takes an array of promises as an argument.
 * - It returns a new Promise.
 * - When all input promises succeed, the returned Promise resolves with an array of results (in the same order as the input).
 * - If **any** promise in the array fails, the returned Promise should immediately reject with the failure reason of that first failing promise.
 * @param {Promise[]} promises any promises array.
 * @returns {Promise} the returned Promise resolves with an array of results (in the same order as the input). If **any** promise in the array fails, the returned Promise should immediately reject with the failure reason of that first failing promise.
 */
function Promise_all(promises) {
  let result = []
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([])
    }
    for (const promise of promises) {
      promise
        .then((val) => {
          result.push(val)
          if (result.length === promises.length) {
            resolve(result)
          } else {
            return result
          }
        })
        .catch((reason) => {
          reject(`Rejected ${reason}`)
        })
    }
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
