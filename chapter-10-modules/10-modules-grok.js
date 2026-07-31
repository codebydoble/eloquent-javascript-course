/**
 * Eloquent JavaScript - Chapter 10: Modules
 * Offline Study Guide + Examples
 * Run with: node chapter10-modules-study.js
 * (For full module examples, you need multiple files)
 */

console.log("=== Chapter 10: Modules ===\n")

// 1. Simulating a simple module system (IIFE pattern - old way)
const weekDay = (function () {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return {
    name(number) {
      return names[number]
    },
    number(name) {
      return names.indexOf(name)
    },
  }
})()

console.log("IIFE Module:", weekDay.name(weekDay.number("Sunday"))) // Sunday

// 2. Modern ES Module simulation (in one file for demo)
const dayModule = (function () {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  function dayName(number) {
    return names[number]
  }

  function dayNumber(name) {
    return names.indexOf(name)
  }

  return { dayName, dayNumber } // public interface
})()

console.log("Simulated ES Module:", dayModule.dayName(3)) // Wednesday

// 3. Practical Examples

// Example: Configuration Module
const configModule = (function () {
  const defaults = {
    theme: "dark",
    language: "en",
    debug: false,
  }

  let config = { ...defaults }

  return {
    set(newConfig) {
      config = { ...config, ...newConfig }
    },
    get(key) {
      return config[key]
    },
    reset() {
      config = { ...defaults }
    },
  }
})()

configModule.set({ debug: true })
console.log("Config debug:", configModule.get("debug"))

// 4. CommonJS Style Simulation
function requireSim(name) {
  if (name === "formatter") {
    return {
      formatDate(date) {
        return date.toISOString().slice(0, 10)
      },
    }
  }
}

const formatter = requireSim("formatter")
console.log("Formatted date:", formatter.formatDate(new Date()))

console.log("\n=== Key Takeaways ===")
console.log("- Use ES modules (import/export) for new code")
console.log("- Keep modules small and focused")
console.log("- Explicit dependencies > global variables")
console.log("- Good interfaces = predictable & composable")
console.log("- Bundlers handle performance for browsers")

// === Exercises from the Book ===
console.log("\n=== Exercises to Practice ===")
console.log("1. Implement a minimal module loader (like the book's require example)")
console.log("2. Create a module for vector math (add, subtract, length)")
console.log("3. Refactor a previous project (e.g., robot from Ch7) into modules")
console.log("4. Compare CommonJS vs ES modules differences")

/* 
To really practice:
1. Create multiple .js files in a folder
2. Use import/export
3. Run with Node: node --experimental-modules main.js (older Node) 
   or just node main.js (modern Node with "type": "module" in package.json)
4. Try Vite or Parcel for browser modules
*/
