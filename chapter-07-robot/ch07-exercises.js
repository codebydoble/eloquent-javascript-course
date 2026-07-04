/**
 * Chapter 7 Project: A robot
 * Author: Yoandy Doble Herrera
 * Date: 29/06/2026
 */

/*
Chapter 7 of Eloquent JavaScript teaches:
Object-Oriented Programming concepts
-> Graph data structures (village map)
-> State management (robot carrying parcels)
-> Algorithm comparison (random vs. smart robots)
-> Optimization (finding efficient routes)
The Story: A robot must deliver parcels around the village of Meadowfield. The village has 11 locations connected by roads. The robot picks up and delivers packages by traveling between locations.
*/
/*
========================================
MEADOWFIELD MAIL ROBOT
Eloquent JavaScript - Chapter 7
========================================

CONCEPTS COVERED:
1. Graph data structures (village map)
2. State management (immutable state)
3. Different robot strategies (algorithms)
4. Recursion (findRoute)
5. Object-Oriented Programming
6. Algorithm efficiency comparison

VILLAGE MAP:
         Farm
        /    \
   Cabin    Alice's House
     |      /
   Post    Ernie's House
   Office  |
     |     Bob's House
   Town   /
   Hall--
     |    \
   Daria's  Marketplace
   House    |
        \  Grete's House
         \ /
          (connected)
*/

"use strict"

// ========================================
// SECTION 1: THE VILLAGE MAP (GRAPH)
// ========================================

/*
CONCEPT: Graph Data Structure
A graph is a collection of NODES (locations) connected by EDGES (roads).
This is an UNDIRECTED graph: if you can go A→B, you can also go B→A.

The roads array defines all connections between locations.
Format: "LocationA-LocationB"
*/

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
]

/*
FUNCTION: buildGraph
Converts the roads array into an ADJACENCY LIST (graph).
An adjacency list stores, for each location, all its neighbors.

Input:  ["Alice's House-Bob's House", ...]
Output: {
  "Alice's House": ["Bob's House", "Cabin", "Post Office"],
  "Bob's House": ["Alice's House", "Town Hall"],
  ...
}

WHY ADJACENCY LIST?
- O(1) lookup for neighbors of a node
- Efficient for sparse graphs (not every node connects to every other)
- Easy to traverse
*/
function buildGraph(roads) {
  // Start with empty object (no connections yet)
  const graph = Object.create(null)

  /*
  Helper function: addEdge
  Adds a ONE-WAY connection from 'from' to 'to'
  Called TWICE for each road (both directions)
  */
  function addEdge(from, to) {
    if (graph[from] === undefined) {
      // First time we see this location - create array with first neighbor
      graph[from] = [to]
    } else {
      // Location already exists - add new neighbor
      graph[from].push(to)
    }
  }

  /*
  Process each road:
  "Alice's House-Bob's House"
  → split("-") → ["Alice's House", "Bob's House"]
  → destructure → from="Alice's House", to="Bob's House"
  → addEdge both ways (undirected graph)
  */
  for (const [from, to] of roads.map((road) => road.split("-"))) {
    addEdge(from, to)
    addEdge(to, from) // Road goes BOTH ways
  }

  return graph
}

// Build the village graph
const roadGraph = buildGraph(roads)

// ========================================
// SECTION 2: VILLAGE STATE (IMMUTABLE)
// ========================================

/*
CONCEPT: Immutable State
Instead of MODIFYING the state (robot position, parcels),
we CREATE A NEW STATE for each move.

WHY IMMUTABLE?
- Easier to reason about (no side effects)
- Can track history of states
- Prevents bugs from accidental modification
- Better for testing

STATE CONTAINS:
- place: Where the robot currently is (string)
- parcels: Array of {address, place} objects
  - place: Where the parcel currently is (to be picked up)
  - address: Where the parcel needs to be delivered
*/

class VillageState {
  /**
   * Constructor: Creates initial state
   * @param {String} place place - Robot's current location.
   * @param {Array} parcels parcels - Array of {place, address} objects.
   */
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }

  /**
  * METHOD: move(destination)
  The CORE logic of the simulation.
  
  Returns a NEW VillageState (doesn't modify current state).
  * @param {String} destination destination - Where robot wants to move.
  * @returns {VillageState} New state after the move.
  */
  move(destination) {
    // VALIDATION: Can only move to connected locations
    // roadGraph[this.place] = array of neighbors
    // If destination is NOT in neighbors, return same state (invalid move)
    if (!roadGraph[this.place].includes(destination)) {
      console.log(`  ✗ Cannot move from ${this.place} to ${destination} (not connected)`)
      return this
    }

    /*
    UPDATE PARCELS:
    When robot moves to destination, two things can happen:
    
    1. PICK UP: Parcel is at current destination
       parcel.place === destination
       → parcel.place becomes destination (robot carries it)
       Wait... actually parcel gets updated:
       → {address: parcel.address, place: destination}
       
    2. DELIVER: Parcel address is destination AND robot is carrying it
       parcel.address === destination AND parcel.place === this.place
       → parcel is REMOVED from array (delivered!)
       
    SIMPLIFIED LOGIC:
    - Map all parcels to updated positions
    - Filter out delivered parcels (parcel.place === parcel.address)
    */
    const newParcels = this.parcels
      // Update parcel location:
      // If parcel is at robot's current location, robot picks it up
      // Picked up = parcel travels with robot = parcel.place = destination
      .map((parcel) => {
        if (parcel.place !== this.place) {
          // Parcel is somewhere else - don't change it
          return parcel
        }
        // Parcel is here - robot picks it up, moves it to destination
        return { place: destination, address: parcel.address }
      })
      // Remove delivered parcels:
      // A parcel is delivered when it's AT its address
      .filter((parcel) => parcel.place !== parcel.address)

    // Return NEW state (immutable!)
    return new VillageState(destination, newParcels)
  }

  /**
   * STATIC METHOD: random Creates a random initial state for testing/simulation.
   * @param {number} parcelCount - How many parcels to create
   * @returns {VillageState} Random initial state
   */
  static random(parcelCount = 5) {
    const places = Object.keys(roadGraph) // All village locations

    // Create random parcels
    const parcels = []
    for (let i = 0; i < parcelCount; i++) {
      // Random destination (where to deliver)
      const address = randomPick(places)

      // Random starting location (where parcel currently is)
      // Must be DIFFERENT from address (can't deliver to same place)
      let place
      do {
        place = randomPick(places)
      } while (place === address)

      parcels.push({ place, address })
    }

    return new VillageState("Post Office", parcels)
  }
}

// ========================================
// SECTION 3: HELPER FUNCTIONS
// ========================================

/**
 * FUNCTION: randomPick
Returns a random element from an array.
Used by random robot and VillageState.random()
 * @param {Array} array - Any array
 * @returns {*} Random element from array
 */
function randomPick(array) {
  const choice = Math.floor(Math.random() * array.length)
  return array[choice]
}

/*

*/
/**
 * FUNCTION: runRobot
The SIMULATION ENGINE.
Runs a robot until all parcels are delivered.
* @param {VillageState} state - Initial state
* @param {Function} robot - Robot function (state, memory) => {direction, memory}
* @param {Array} memory - Robot's initial memory (different robots use differently)
* @returns {number} Steps taken to deliver all parcels
 */
function runRobot(state, robot, memory = []) {
  let steps = 0
  console.log(`  📍 Starting at: ${state.place}`)
  console.log(`  📦 Parcels to deliver: ${state.parcels.length}`)
  console.log(state.parcels)
  let toDeliver = state.parcels.length
  while (state.parcels.length > 0) {
    // Ask robot: "Where should we go next?"
    // Robot returns: { direction: "Town Hall", memory: [...] }
    const action = robot(state, memory)
    console.log(`  Where should we go next?:`)
    console.log(action)
    // Move robot to chosen direction
    state = state.move(action.direction)
    console.log(`  Robot moved to: ${action.direction} `)
    console.log(`  Robot memory: ${action.memory} `)
    console.log(`  STATE `)
    console.log(state)
    // Update robot's memory (some robots track state between moves)
    memory = action.memory
    console.log(`  Robot memory: ${action.memory} `)
    steps++

    // Show progress every move
    console.log(
      `  Step ${steps}: Moved to ${state.place}, ${state.parcels.length} parcels remaining --- Delivered: ${toDeliver - state.parcels.length} `,
    )
  }

  console.log(`  ✅ Done! Delivered all parcels in ${steps} steps\n`)
  return steps
}

// ========================================
// SECTION 4: ROBOT STRATEGIES
// ========================================

/*
STRATEGY 1: RANDOM ROBOT
The simplest possible robot.
Just picks a random road and goes there.
No memory, no planning.

EFFICIENCY: Very poor
Average steps: 50-60 for 5 parcels
WHY SO BAD? 
- No strategy whatsoever
- May revisit same locations many times
- No awareness of parcel locations
*/
/**
 *
 * @param {VillageState} state
 * @returns {Object}
 */
function randomRobot(state) {
  // Pick random neighbor and go there
  // No memory needed (pass empty array)
  return {
    direction: randomPick(roadGraph[state.place]),
    memory: [],
  }
}

/*
STRATEGY 2: ROUTE ROBOT (Pre-planned Route)
Uses a fixed, pre-planned route that visits all locations.
Follows the same route regardless of where parcels are.

THE MAIL ROUTE (visits all 11 locations):
Post Office → Alice's House → Bob's House → Town Hall → 
Daria's House → Ernie's House → Grete's House → Shop → 
Marketplace → Farm → Cabin → ... → Post Office

CONCEPT: Memory as remaining route
- Memory stores the remaining steps in current route
- When route is complete, start over from beginning
- This guarantees visiting all locations

EFFICIENCY: Better than random
Average steps: ~26 for 5 parcels
WHY BETTER?
- Systematic coverage of village
- No wasted random moves
WHY STILL NOT OPTIMAL?
- Ignores actual parcel locations
- Always follows same route even if parcels are nearby
*/

// A route that visits all locations
const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Marketplace",
  "Farm",
  "Marketplace",
  "Post Office",
]

const mailRouteTwo = [
  "Post Office",
  "Marketplace",
  "Farm",
  "Grete's House",
  "Ernie's House",
  "Daria's House",
  "Town Hall",
  "Shop",
  "Marketplace",
  "Post Office",
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
]

/**
 *
 * @param {VillageState} state
 * @param {Array} memory
 * @returns
 */
function routeRobot(state, memory) {
  /*
  MEMORY: Remaining steps in current route
  
  If memory is empty ([], first run or route complete):
    → Start the full mail route again
  If memory has steps:
    → Take next step from memory
    → Remove that step (it's done)
  */
  if (memory.length === 0) {
    // Start route over
    memory = mailRoute
  }

  return {
    direction: memory[0], // Next stop in route
    memory: memory.slice(1), // Remove first element (it's done)
  }
}

/*
STRATEGY 3: GOAL-ORIENTED ROBOT (Pathfinding)
The smart robot!
Uses BFS (Breadth-First Search) to find shortest path.

LOGIC:
1. Find all undelivered parcels
2. Pick a goal:
   - If carrying parcels → go to delivery address
   - If not carrying → go to pick up location
3. Find SHORTEST path to goal using BFS
4. Take first step of that path

CONCEPT: BFS (Breadth-First Search)
Explores all paths level by level.
Guarantees finding SHORTEST path.

EFFICIENCY: Much better
Average steps: ~16 for 5 parcels
WHY BETTER?
- Takes shortest path to each goal
- Prioritizes delivery over pickup
- No wasted moves
*/

/**
 * FUNCTION: findRoute (BFS implementation)
Finds shortest path between two locations in the graph.
 * @param {Object} graph - Road graph (adjacency list)
 * @param {string} from - Starting location 
 * @param {string} to - Target location 
 * @returns {Array} Array of locations representing shortest path
 */
function findRoute(graph, from, to) {
  /*
  BFS ALGORITHM:
  
  Uses a QUEUE (work list) of paths to explore.
  Each item in queue is an array representing a path tried so far.
  
  Start: [["Post Office"]]  (array of paths, starting with just start location)
  
  Process:
  1. Take first path from queue
  2. If last location is destination → FOUND! Return path
  3. Otherwise → explore all neighbors:
     - Add to already-visited set (avoid loops)
     - Create new path = current path + neighbor
     - Add new path to queue
  4. Repeat until destination found
  
  EXAMPLE:
  From: "Post Office" To: "Alice's House"
  
  Queue start: [["Post Office"]]
  
  Step 1:
    Take ["Post Office"]
    Neighbors: ["Alice's House", "Marketplace"]
    Add to visited: "Post Office"
    New paths: ["Post Office", "Alice's House"], ["Post Office", "Marketplace"]
    Queue: [["Post Office", "Alice's House"], ["Post Office", "Marketplace"]]
  
  Step 2:
    Take ["Post Office", "Alice's House"]
    Last = "Alice's House" = destination!
    Return ["Post Office", "Alice's House"]
    
  Route found: ["Post Office", "Alice's House"]
  Direction: "Alice's House" (first step)
  */

  // Work list: starts with path containing just the starting location
  const work = [{ at: from, route: [] }]

  // Track visited locations to avoid infinite loops
  const visited = new Set([from])

  while (work.length > 0) {
    // Take next path to explore (FIFO queue)
    const { at, route } = work.shift()

    // Explore all roads from current location
    for (const place of graph[at]) {
      // FOUND! Return the route to get here
      if (place === to) {
        return [...route, place]
      }

      // Not visited yet? Add to queue with updated route
      if (!visited.has(place)) {
        visited.add(place)
        work.push({
          at: place,
          route: [...route, place],
        })
      }
    }
  }

  // Should never reach here if graph is connected
  return []
}

/**
 *
 * @param {VillageState} state
 * @param {String[]} memory
 * @returns {Object}
 */
function goalOrientedRobot(state, memory) {
  /*
  MEMORY: Remaining steps to current goal
  
  If memory is empty (no current goal):
    → Find a new goal and calculate route
  If memory has steps:
    → Continue following current route
  */

  if (memory.length === 0) {
    // Find a new goal
    let parcel = state.parcels[0]
    console.log(parcel)
    if (parcel.place !== state.place) {
      /*
      Parcel is NOT here - need to GO PICK IT UP
      Set route to parcel's location
      */
      memory = findRoute(roadGraph, state.place, parcel.place)
    } else {
      /*
      Parcel IS here (robot is carrying it) - need to DELIVER IT
      Set route to parcel's address
      */
      memory = findRoute(roadGraph, state.place, parcel.address)
    }
  }
  return {
    direction: memory[0], // Next step toward goal
    memory: memory.slice(1), // Remove completed step
  }
}

/* 
Exercise 1
*/

/**
 *
 * @param {Function} firstRobot {direction: randomPick(roadGraph[state.place]),  memory: [],}
 * @param {Array} firstRobotMemory
 * @param {Function} secondRobot {direction: randomPick(roadGraph[state.place]),  memory: [],}
 * @param {Array} secondRobotMemory
 */
const compareRobots = (firstRobot, firstRobotMemory, secondRobot, secondRobotMemory) => {
  // 1. Create 100 task
  const oneHundredTasks = VillageState.random(100)
  /* 2. Run robots  
   Permitir que cada uno de los robots resuelva cada una de estas tareas.
        - 1: goalOrientedRobot
        - 2: optimuxRobot
  */

  /**
   * FUNCTION: runRobot The SIMULATION ENGINE. Runs a robot until all parcels are delivered.
   * @param {VillageState} state - Initial state
   * @param {Function} robot - Robot function (state, memory) => {direction, memory}
   * @param {String[]} memory - Robot's initial memory (different robots use differently)
   * @returns {Object} task/steps to deliver parcel
   */
  function simulationEngine(state, robot, memory = []) {
    let steps = 0 // Steps taken to deliver all parcels
    console.log(`  📍 Robot starting at: ${state.place}`)
    console.log(`  📦 Parcels to deliver: ${state.parcels.length}`)
    let parcelsTotal = state.parcels.length // Copy parcel length
    let stepsParcels = []
    let delivered = 0
    let stepsUpdate = 0

    while (state.parcels.length > 0) {
      // Ask robot: "Where should we go next?"
      // Robot returns: { direction: "Town Hall", memory: [...] }
      const action = robot(state, memory)
      // Move robot to chosen direction
      state = state.move(action.direction)
      // Update robot's memory (some robots track state between moves)
      memory = action.memory
      steps++

      // Show progress every move
      console.log(`  Step ${steps}: Moved to ${state.place}, ${state.parcels.length} parcels remaining `)
      // Update map delivered task and steps
      if (parcelsTotal - state.parcels.length > delivered) {
        delivered = parcelsTotal - state.parcels.length
        if (stepsParcels.length === 0) {
          stepsParcels.push(steps)
          stepsUpdate = steps
        } else {
          stepsParcels.push(steps - stepsUpdate)
          stepsUpdate = steps
        }
      }
    }

    console.log(`  ✅ Done! Delivered all parcels in ${steps} steps\n`)

    // Floor by task/step
    return stepsParcels.reduce((prom, step, index, entireArr) => {
      prom += step
      if (index === entireArr.length - 1) {
        return Number(prom / entireArr.length).toFixed(2)
      }
      return prom
    }, 0)
  }
  const robotOnePromedy = simulationEngine(oneHundredTasks, firstRobot, firstRobotMemory)
  const robotTwoPromedy = simulationEngine(oneHundredTasks, secondRobot, secondRobotMemory)
  return `Robot 1: ${robotOnePromedy} \nRobot 2: ${robotTwoPromedy}`
}

// 100 tasks for each robot
const robotsInfo = compareRobots(goalOrientedRobot, [], optimuxRobot, [])
console.log("=== STRATEGY 4: ROBOT MEASURE ===")
console.log(robotsInfo)

/**
 * Exercise 2
 */

/**
 * OPTIMIZED ROBOT (Challenge Improvement)
 
IMPROVEMENTS over Strategy 3:
1. Considers ALL parcels, not just first one
2. Picks the CLOSEST goal (pickup or delivery)
3. Prioritizes deliveries over pickups
 * @param {VillageState} state class VillageState.
 * @param {String[]} memory initial robot memory.
 * @returns {Object} the closest goal (pickup or delivery).
 */
function optimuxRobot(state, memory) {
  if (memory.length === 0) {
    let routeParcel = null
    for (const parcel of state.parcels) {
      let route
      if (parcel.place !== state.place) {
        /*
       Need to GO PICK IT UP - Set route to parcel's location
      */
        route = findRoute(roadGraph, state.place, parcel.place)
      } else {
        /*N
        Need to DELIVER IT - Set route to parcel's address
      */
        route = findRoute(roadGraph, state.place, parcel.address)
      }
      if (routeParcel === null || route.length < routeParcel.length) {
        routeParcel = route
      }
    }
    memory = routeParcel
  }
  return {
    direction: memory[0], // Next step toward goal
    memory: memory.slice(1), // Remove completed step
  }
}

/**
 * Exercise 3
 */

/**
 * Clase PGroup que almacena un conjunto de valores. Al igual que Grupo, tiene métodos add, delete, y has.
 */
class PGroup {
  constructor() {
    this.empty = []
  }
  /**
   * Método add debería devolver una nueva instancia de PGroup con el miembro dado añadido y dejar la anterior sin cambios.
   * @param {String|Number|Boolean} value cualquier valor.
   * @return {PGroup} una nueva instancia de PGroup con el miembro dado añadido.
   */
  add(value) {
    let copyEmpty = [...this.empty]
    let copyPGroup = new PGroup()
    if (!this.has(value)) {
      copyEmpty.push(value)
      copyPGroup.empty = [...copyEmpty]
      return copyPGroup
    } else {
      return this.empty
    }
  }

  /**
   * Método has comprueba si un valor se encuentra en el grupo.
   * @param {String|Number|Boolean} value cualquier valor.
   * @returns {Boolean} true si aparece o false en otro caso.
   */
  has(value) {
    return this.empty.includes(value) ? true : false
  }

  /**
   * Método delete crea una nueva instancia sin un miembro dado.
   * @param {String|Number|Boolean} value cualquier valor.
   * @return {PGroup} una nueva instancia de PGroup con el miembro dado eliminado.
   */
  delete(value) {
    if (this.has(value)) {
      let copyEmpty = [...this.empty]
      let copyPGroup = new PGroup()
      console.log(">>>fn Delete - group copy ", copyEmpty)
      console.log(">>>value ", value)
      let indexValue = copyEmpty.findIndex((v) => v === value)
      console.log(">>>index ", indexValue)
      copyEmpty.splice(indexValue, 1)
      copyPGroup.empty = [...copyEmpty]
      return copyPGroup
    } else {
      return this
    }
  }
}

let myGroup = new PGroup()
console.log(">>>Group", myGroup)
let myGroup1 = myGroup.add("Yoandy")
console.log(">>>Group 1 ", myGroup1)
console.log(">>>Group untouch ", myGroup)
let myGroup2 = myGroup1.add(35)
console.log(">>>Group 2 ", myGroup2)
console.log(">>>Group 1 untouch ", myGroup1)
let myGroup3 = myGroup2.delete("Yoandy")
console.log(">>>Group 3 ", myGroup3)
console.log(">>>Group 2 untouch ", myGroup2)
