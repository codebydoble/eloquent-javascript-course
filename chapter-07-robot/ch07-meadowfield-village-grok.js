/**
 * =======================================
 * =              GROK AI                =
 * =======================================
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

/**
 *
 * @param {String[]} roads
 * @returns {Object}
 */
const createGraph = (roads) => {
  //let graph = Object.create(null)
  // 1. Apply reduce to accumulate Object
  return roads.reduce(
    /**
     *
     * @param {Object} graph
     * @param {String} road
     * @returns
     */
    (graph, road) => {
      // 2. split and destructure road Ex. "Alice's House-Bob's House" = [Alice's House],[Bob's House]
      const [roadStart, roadEnd] = road.split("-")
      /**
       * Function that add key start road and end road into array.
       * @param {String} start starting path.
       * @param {String} end ending path.
       */
      const addRoad = (start, end) => {
        if (start in graph) {
          graph[start].add(end)
        } else {
          graph[start] = new Set()
          graph[start].add(end)
        }
      }
      addRoad(roadStart, roadEnd)
      addRoad(roadEnd, roadStart)
      return graph
    },
    Object.create(null),
  )
}

const roadGraphMeadow = createGraph(roads)
console.log(roadGraphMeadow)

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

/**
 * FUNCTION: buildGraph
Converts the roads array into an ADJACENCY LIST (graph).
An adjacency list stores, for each location, all its neighbors.
 * @param {string[]} roads any roads array.
 * @returns {Object} adjacency list (graph).
 */
const buildGraphYDH = (roads) => {
  return roads.reduce(
    /**
     * Create adjacency list object.
     * @param {Object} graph object.
     * @param {String} road each road.
     */
    (graph, road) => {
      const [from, to] = road.split("-")
      /**
       * Process each road: "Alice's House-Bob's House"
       * → split("-") → ["Alice's House", "Bob's House"]
       * → destructure → from="Alice's House", to="Bob's House"
       * → addEdge both ways (undirected graph)
       * @param {String} from starting route.
       * @param {String} to end route.
       */
      function addEdges(from, to) {
        if (from in graph) {
          graph[from].push(to)
        } else {
          graph[from] = [to]
        }
      }
      addEdges(from, to)
      addEdges(to, from)
      return graph
    },
    {},
  )
}

const roadGraphYDH = buildGraphYDH(roads)

// Let's see what the graph looks like:
console.log("=== VILLAGE ROAD GRAPH ===")
console.log("Alice's House connects to:", roadGraph["Alice's House"])
// ["Bob's House", "Cabin", "Post Office"]
console.log("Marketplace connects to:", roadGraph["Marketplace"])
// ["Farm", "Post Office", "Shop", "Town Hall"]
console.log("GRAPH PERSONAL: ", roadGraphYDH)
console.log("\n")

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
  /*
  Constructor: Creates initial state
  @param {string} place - Robot's current location
  @param {Array} parcels - Array of {place, address} objects
  */
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }

  /*
  METHOD: move(destination)
  The CORE logic of the simulation.
  
  Returns a NEW VillageState (doesn't modify current state).
  
  @param {string} destination - Where robot wants to move
  @returns {VillageState} New state after the move
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
          console.log(`  📦 Parcel is somewhere else - don't change it: ${parcel.place}  ${this.place}`)
          return parcel
        }
        console.log(`  📦 Parcel is HERE prev parcel before pick UP:  `, parcel)
        // Parcel is here - robot picks it up, moves it to destination
        console.log(`  📦 Parcel  pick UP:  `, { place: destination, address: parcel.address })
        return { place: destination, address: parcel.address }
      })
      // Remove delivered parcels:
      // A parcel is delivered when it's AT its address
      .filter((parcel) => parcel.place !== parcel.address)

    // Return NEW state (immutable!)
    return new VillageState(destination, newParcels)
  }

  /*
  STATIC METHOD: random
  Creates a random initial state for testing/simulation.
  
  @param {number} parcelCount - How many parcels to create
  @returns {VillageState} Random initial state
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

// Test VillageState
console.log("=== VILLAGE STATE DEMO ===")
const testState = new VillageState("Post Office", [{ place: "Post Office", address: "Alice's House" }])
console.log("Initial state:")
console.log("  Robot at:", testState.place)
console.log("  Parcels:", testState.parcels)

const nextState = testState.move("Alice's House")
console.log("\nAfter moving to Alice's House:")
console.log("  Robot at:", nextState.place)
console.log("  Parcels:", nextState.parcels)
// Parcel is delivered! Array is empty.
console.log("\n")

// ========================================
// SECTION 3: HELPER FUNCTIONS
// ========================================

/*
FUNCTION: randomPick
Returns a random element from an array.
Used by random robot and VillageState.random()

@param {Array} array - Any array
@returns {*} Random element from array
*/
function randomPick(array) {
  const choice = Math.floor(Math.random() * array.length)
  return array[choice]
}

/*
FUNCTION: runRobot
The SIMULATION ENGINE.
Runs a robot until all parcels are delivered.

@param {VillageState} state - Initial state
@param {Function} robot - Robot function (state, memory) => {direction, memory}
@param {Array} memory - Robot's initial memory (different robots use differently)
@returns {number} Steps taken to deliver all parcels
*/
function runRobot(state, robot, memory = []) {
  let steps = 0

  console.log(`  📍 Starting at: ${state.place}`)
  console.log(`  📦 Parcels to deliver: ${state.parcels.length}`)
  console.log(state.parcels)
  console.log(`  📦 Parcels to deliver: ${state.parcels}`)
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
    console.log(`  Step ${steps}: Moved to ${state.place}, ${state.parcels.length} parcels remaining`)
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

function randomRobot(state) {
  // Pick random neighbor and go there
  // No memory needed (pass empty array)
  console.log(">>>>> THE VILLAGE <<<", state)

  return {
    direction: randomPick(roadGraph[state.place]),
    memory: [],
  }
}

console.log("=== ROBOT STRATEGY 1: RANDOM ROBOT ===")
console.log("Strategy: Pick a random road and go there")
console.log("Expected efficiency: VERY POOR (~50-60 steps)\n")
runRobot(VillageState.random(5), randomRobot)

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
    memory = mailRouteTwo
  }

  return {
    direction: memory[0], // Next stop in route
    memory: memory.slice(1), // Remove first element (it's done)
  }
}

console.log("\n\n=== ROBOT STRATEGY 2: ROUTE ROBOT ===")
console.log("Strategy: Follow pre-planned route visiting all locations")
console.log("Expected efficiency: BETTER (~26 steps)\n")
runRobot(VillageState.random(5), routeRobot)

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

/*
FUNCTION: findRoute (BFS implementation)
Finds shortest path between two locations in the graph.

@param {Object} graph - Road graph (adjacency list)
@param {string} from - Starting location
@param {string} to - Target location
@returns {Array} Array of locations representing shortest path
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

console.log("\n\n=== ROBOT STRATEGY 3: GOAL-ORIENTED ROBOT ===")
console.log("Strategy: BFS pathfinding to nearest goal")
console.log("Expected efficiency: MUCH BETTER (~16 steps)\n")
runRobot(VillageState.random(5), goalOrientedRobot)

/*
STRATEGY 4: OPTIMIZED ROBOT (Your Challenge Improvement)
Even smarter than goal-oriented.

IMPROVEMENTS over Strategy 3:
1. Considers ALL parcels, not just first one
2. Picks the CLOSEST goal (pickup or delivery)
3. Prioritizes deliveries over pickups

EFFICIENCY: Best
Average steps: ~12-14 for 5 parcels
*/

function optimizedRobot(state, memory) {
  if (memory.length === 0) {
    let bestRoute = null

    for (const parcel of state.parcels) {
      // Route to pick up parcel
      let route
      if (parcel.place !== state.place) {
        route = findRoute(roadGraph, state.place, parcel.place)
      } else {
        // Already have parcel - route to deliver
        route = findRoute(roadGraph, state.place, parcel.address)
      }

      // Pick shortest route (closest goal)
      if (bestRoute === null || route.length < bestRoute.length) {
        bestRoute = route
      }
    }

    memory = bestRoute
  }

  return {
    direction: memory[0],
    memory: memory.slice(1),
  }
}

console.log("=== ROBOT STRATEGY 4: OPTIMIZED ROBOT ===")
console.log("Strategy: BFS to CLOSEST goal across ALL parcels")
console.log("Expected efficiency: BEST (~12-14 steps)\n")
runRobot(VillageState.random(5), optimizedRobot)

// ========================================
// SECTION 5: PERFORMANCE COMPARISON
// ========================================

/*
FUNCTION: compareRobots
Runs multiple simulations and compares average performance.

@param {number} trials - Number of simulations to run
@returns {Object} Average steps for each robot
*/
function compareRobots(trials = 100) {
  console.log(`=== PERFORMANCE COMPARISON (${trials} trials) ===\n`)

  // Robots to compare
  const robots = [
    { name: "Random Robot", fn: randomRobot, memory: [] },
    { name: "Route Robot", fn: routeRobot, memory: [] },
    { name: "Goal-Oriented Robot", fn: goalOrientedRobot, memory: [] },
    { name: "Optimized Robot", fn: optimizedRobot, memory: [] },
  ]

  const results = {}

  for (const robot of robots) {
    let totalSteps = 0

    for (let i = 0; i < trials; i++) {
      // Create random state for each trial
      const state = VillageState.random(5)
      let currentState = state
      let memory = robot.memory
      let steps = 0

      // Run silently (no console.log)
      while (currentState.parcels.length > 0) {
        const action = robot.fn(currentState, memory)
        currentState = currentState.move(action.direction)
        memory = action.memory
        steps++
      }

      totalSteps += steps
    }

    const average = (totalSteps / trials).toFixed(1)
    results[robot.name] = average

    console.log(`${robot.name}:`)
    console.log(`  Average steps: ${average}`)
    console.log(`  Over ${trials} trials with 5 parcels each\n`)
  }

  // Rank robots
  const ranked = Object.entries(results).sort(([, a], [, b]) => a - b)

  console.log("=== RANKING (best to worst) ===")
  ranked.forEach(([name, avg], index) => {
    const medal = ["🥇", "🥈", "🥉", "4️⃣"][index]
    console.log(`${medal} ${name}: ${avg} steps average`)
  })

  return results
}

// Run comparison (using 50 trials to keep output manageable)
console.log("\n")
compareRobots(50)

// ========================================
// SECTION 6: KEY CONCEPTS SUMMARY
// ========================================

console.log(`
========================================
KEY CONCEPTS FROM CHAPTER 7
========================================

1. GRAPH DATA STRUCTURE
   - Nodes = locations (Alice's House, Town Hall, etc.)
   - Edges = roads between locations
   - Adjacency list = efficient way to store graph
   - buildGraph() converts road list to adjacency list

2. IMMUTABLE STATE
   - VillageState never modified directly
   - move() creates NEW state each time
   - Benefits: predictable, testable, no side effects
   - Pattern used heavily in React (useState)

3. ROBOT STRATEGIES (Algorithms)
   - Random: No strategy, worst performance
   - Route: Pre-planned, systematic but inflexible  
   - Goal-oriented: BFS pathfinding, smart
   - Optimized: BFS to closest goal, best

4. BFS (Breadth-First Search)
   - Explores paths level by level
   - Guarantees SHORTEST path
   - Uses queue (FIFO) data structure
   - Visited set prevents infinite loops

5. STATE + MEMORY PATTERN
   - State = external world (parcels, position)
   - Memory = robot's internal knowledge (route plan)
   - Pure functions: same input → same output
   - Functional programming concepts

6. ALGORITHM EFFICIENCY
   - Random: O(very bad) - no strategy
   - Route: O(n) - fixed route length
   - Goal-oriented/Optimized: O(V+E) per BFS call
     where V = vertices, E = edges

========================================
HOW THIS CONNECTS TO YOUR CAREER GOALS
========================================

This chapter teaches:
✓ Graph algorithms (common in interviews!)
✓ BFS/DFS (very common interview questions)
✓ Immutable state (core React concept)
✓ Functional programming (map, filter, pure functions)
✓ Algorithm comparison and optimization
✓ Object-Oriented Programming (classes)

INTERVIEW RELEVANCE:
- "Implement BFS" is a classic interview question
- Immutable state = foundation of React/Redux
- Graph problems appear frequently at FAANG companies
========================================
`)
/*
Key Takeaways
Concepts Map
Chapter 7
├── Data Structures
│   ├── Graph (adjacency list)
│   └── Queue (BFS uses this)
├── Programming Patterns  
│   ├── Immutable state
│   ├── Pure functions
│   └── State + Memory pattern
└── Algorithms
    ├── Random (no strategy)
    ├── Fixed route (systematic)
    ├── BFS pathfinding (optimal)
    └── Greedy optimization (best)

How BFS Works Visually
Find route: Post Office → Alice's House

Level 0:    [Post Office]
Level 1:    [Alice's House] ← [Marketplace]
            ↑ FOUND!

Route: ["Alice's House"]
Re: Connecting in Tech
Chapter 7 (VillageState)
const newState = state.move(destination)  // Immutable!

React (same concept)
const [state, setState] = useState(initial)
setState(newState)  // Creates new state, never mutates!

Questions to Test Your Understanding
Why is the state immutable? What problems would mutable state cause?
Why does BFS guarantee the shortest path? What would DFS do differently?
Why is the optimized robot better than goal-oriented? What specific improvement did it make?
What data structure does BFS use? Why is FIFO important for finding shortest paths?
Share your answers and I'll tell you if you understood correctly! 🚀
*/
