/**
 * FUNCTION: buildGraph Converts the roads array into an ADJACENCY LIST (graph).
An adjacency list stores, for each location, all its neighbors.
 * @param {String[]} roads any roads array.
 * @returns {Object} an adjacency list. It's stores, for each location, all its neighbors.
 */
export function buildGraph(roads) {
  const graph = Object.create(null)
  function addEdge(from, to) {
    if (graph[from] === undefined) {
      graph[from] = [to]
    } else {
      graph[from].push(to)
    }
  }
  for (const [from, to] of roads) {
    addEdge(from, to)
    addEdge(to, from)
  }
  return graph
}
