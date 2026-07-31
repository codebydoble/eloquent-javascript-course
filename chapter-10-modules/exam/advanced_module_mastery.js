/**
 * ============================================================
 * ADVANCED MODULE MASTERY EXAM: CHAPTER 10
 * ============================================================
 * Student: Yoandy Doble Herrera
 * Focus: ESM, CommonJS, Architecture, and Circular Dependencies
 * ------------------------------------------------------------
 */

/* 
  QUESTION 1: THE "TYPE" FIELD
  In your package.json, you added `"type": "module"`. 
  A) What happens to existing files ending in .js if you remove this line?
  R/ The files ending in .js if I remove the line when try to run code I'm going to get the error Syntax Error.
  B) How would you force a single file to act as an ES Module even if 
     "type": "module" is missing from package.json?
  R/ Changing the extension to .mjs or using CommonJS.
*/

/* 
  QUESTION 2: LIVE BINDINGS VS. VALUE COPYING
  Consider the following pseudo-code for two different systems:

  // SYSTEM A (CommonJS)
  let count = 1;
  module.exports = { count, inc: () => count++ };

  // SYSTEM B (ES Modules)
  export let count = 1;
  export const inc = () => count++;

  In both cases, a consumer imports 'count' and 'inc', calls 'inc()', 
  and then logs 'count'. 
  
  Explain why the result differs between the two systems.
  R/ In CommonJS, module.exports creates a snapshot of the values at the moment of export, so count is not a reference to the variable itself. The consumer receives a copy of the primitive value. 
  In ES Modules, exports create live bindings. The import statement creates a read - only view that points directly to the variable inside the exporting module. The variable count is updated after inc()
*/

/* 
  QUESTION 3: CIRCULAR DEPENDENCY INTERNALS
  In the Eloquent JS implementation of `require`, we see this:
  require.cache[name] = exports;
  wrapper(require, exports);

  Why is it critical that the cache is updated BEFORE the wrapper is called? 
  What would happen if we swapped those two lines?

  R/ It's important because avoid upload modules many times. Also ensure required modules is available. It's use a module cache store.  
*/

/* 
  QUESTION 4: ARCHITECTURAL DESIGN (REFRACTORING)
  You have a module 'Database.js' that imports 'Logger.js'. 
  Now, you want 'Logger.js' to save logs to the Database, creating a cycle.
  
  Describe a "Dependency Injection" strategy to solve this without 
  creating a circular import.
  
  R/ Dependency injection strategy. Switch control flow. Instead of Logger.js importing Database.js directly, the Database instance is passed into the Logger at runtime.
  Use principle high-level modules (Logger) should not depend on low-level modules (Database) via direct imports.
  Remove dependency import statement for the database. Instead, accept the database instance via the constructor or a setter method on Logger.js.
  The connection is made in a third file entry point.
*/

/* 
  QUESTION 5: THE DEFAULT EXPORT DEBATE
  In a large-scale project with hundreds of modules, why do many senior 
  engineers recommend using "Named Exports" (export const X) over 
  "Default Exports" (export default X)? 
  (Hint: Think about refactoring and IDE tools).

  R/ Senior recommend "Named Exports" because default is only used when a module only export a single variable, class or function. Also is more scalable to use "Named Exports" or track/fix dependencies.
*/

/**
 * ============================================================
 * PRACTICAL CHALLENGE: THE ADJACENCY LIST
 * ============================================================
 * Below is a broken module setup.
 * Fix the export/import syntax to follow ES Module standards
 * and ensure it runs with "node ch10_exam.js".
 */

// --- PART A: The Utility (Simulate this as if it were graph.js)
export const buildGraph = (edges) => {
  let graph = Object.create(null)
  for (let [from, to] of edges) {
    ;(graph[from] || (graph[from] = [])).push(to)
    ;(graph[to] || (graph[to] = [])).push(from)
  }
  return graph
}

// --- PART B: The Execution
// inference I created file ch10_exam.js to execute code.
import { buildGraph } from "./advanced_module_mastery.js"
const edges = [
  ["A", "B"],
  ["B", "C"],
]
// TODO: Export Part A and Import it here correctly.
// console.log(buildGraph(edges));

console.log("\nExam ready for evaluation. Fill in your answers and return the file.")
