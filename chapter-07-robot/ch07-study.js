"use strict"

/**
 * Chapter 7 A Robot: Meadowfield Village
 * Author: Yoandy Doble Herrera
 * Date: 02/06/2026
 */

const roads = [
  "Casa de Alice-Casa de Bob",
  "Casa de Alice-Cabaña",
  "Casa de Alice-Oficina de Correos",
  "Casa de Bob-Ayuntamiento",
  "Casa de Daria-Casa de Ernie",
  "Casa de Daria-Ayuntamiento",
  "Casa de Ernie-Casa de Grete",
  "Casa de Grete-Granja",
  "Casa de Grete-Tienda",
  "Plaza de Mercado-Granja",
  "Plaza de Mercado-Oficina de Correos",
  "Plaza de Mercado-Tienda",
  "Plaza de Mercado-Ayuntamiento",
  "Tienda-Ayuntamiento",
]

/**
 *
 * @param {String[]} edges
 * @returns {Object}
 */
const buildGraph = (edges) => {
  let graph = Object.create(null)
  let graphTwo = {}
  /**
   *
   * @param {String} from start route.
   * @param {String} to end route.
   */
  const addEdges = (from, to) => {
    if (from in graph) {
      graph[from].push(to)
    } else {
      graph[from] = [to]
    }
  }
  for (const [from, to] of edges.map((r) => r.split("-"))) {
    addEdges(from, to)
    addEdges(to, from)
  }
  return graph
}

const roadGraph = buildGraph(roads)
console.log("ROAD MAP", roadGraph)

class VillageState {
  /**
   *
   * @param {String} place lugar actual del robot.
   * @param {Array} parcels paquetes por entregar.
   */
  constructor(place, parcels) {
    this.place = place
    this.parcels = parcels
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p
          return { place: destination, address: p.address }
        })
        .filter((p) => p.place != p.address)
      return new VillageState(destination, parcels)
    }
  }
}

let first = new VillageState("Oficina de Correos", [{ place: "Oficina de Correos", address: "Casa de Alice" }])
console.log("VillageState", first)
let next = first.move("Casa de Alice")
console.log(next.place)
// → Casa de Alice
console.log(next.parcels)
// → []
console.log(first.place)
// → Oficina de Correos

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Terminado en ${turn} turnos`)
      break
    }
    let action = robot(state, memory)
    state = state.move(action.direction)
    memory = action.memory
    console.log(`Movido a ${action.direction}`)
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length)
  return array[choice]
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) }
}

VillageState.random = function (parcelCount = 5) {
  let parcels = []
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph))
    let place
    do {
      place = randomPick(Object.keys(roadGraph))
    } while (place == address)
    parcels.push({ place, address })
  }
  return new VillageState("Oficina de Correos", parcels)
}
runRobot(VillageState.random(), randomRobot, [])

const mailRoute = [
  "Casa de Alice",
  "Cabaña",
  "Casa de Alice",
  "Casa de Bob",
  "Ayuntamiento",
  "Casa de Daria",
  "Casa de Ernie",
  "Casa de Grete",
  "Tienda",
  "Casa de Grete",
  "Granja",
  "Plaza del Mercado",
  "Oficina de Correos",
]

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute
  }
  return { direction: memory[0], memory: memory.slice(1) }
}
console.log(">>>Route Robot<<<", routeRobot(VillageState.random(), []))

// (graph: Object, from: string, to: string) => string[]
/**
 *
 * @param {Object} graph
 * @param {String} from
 * @param {String} to
 * @returns {String[]}
 */
function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }]
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i]
    for (let place of graph[at]) {
      if (place == to) return route.concat(place)
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) })
      }
    }
  }
}

function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0]
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place)
    } else {
      route = findRoute(roadGraph, place, parcel.address)
    }
  }
  return { direction: route[0], memory: route.slice(1) }
}
