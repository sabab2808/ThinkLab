import { useEffect, useMemo, useState } from 'react'
import { bfs, dfs, dijkstra, astar } from '@thinklab/algorithms'
import MazeGrid from './MazeGrid.jsx'

const ALGORITHMS = [
  { key: 'bfs', label: 'BFS', fn: bfs, blurb: 'Shortest path, unweighted' },
  { key: 'dfs', label: 'DFS', fn: dfs, blurb: 'Depth-first — not generally shortest' },
  { key: 'dijkstra', label: 'Dijkstra', fn: dijkstra, blurb: 'Shortest via a distance queue' },
  { key: 'astar', label: 'A*', fn: astar, blurb: 'Heuristic-guided shortest path' },
]

const TICK_MS = 35

export default function AlgorithmRace({ maze }) {
  // Run every algorithm once, up front — they're pure and fast even on a
  // 10x10+ maze. The "race" is purely a visualization of each one's
  // already-computed visitedOrder, revealed on a shared timer, not a
  // simulation of them actually running concurrently.
  const results = useMemo(
    () => ALGORITHMS.map((a) => ({ ...a, result: a.fn(maze, maze.start, maze.end) })),
    [maze],
  )
  const maxSteps = Math.max(...results.map((r) => r.result.visitedOrder.length))

  const [tick, setTick] = useState(0)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    if (tick >= maxSteps) {
      setRunning(false)
      return
    }
    const id = setTimeout(() => setTick((t) => t + 1), TICK_MS)
    return () => clearTimeout(id)
  }, [tick, running, maxSteps])

  function restart() {
    setTick(0)
    setRunning(true)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {results.map(({ key, label, blurb, result }) => {
          const explored = Math.min(tick, result.visitedOrder.length)
          const done = explored >= result.visitedOrder.length

          return (
            <div key={key}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-sm font-medium">{label}</p>
                {done && (
                  <span className="font-mono text-[10px] text-verified">
                    {result.path.length - 1} moves
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] text-text-muted">{blurb}</p>

              <div className="mt-2">
                <MazeGrid
                  maze={maze}
                  visited={result.visitedOrder.slice(0, explored)}
                  path={done ? result.path : []}
                  compact
                />
              </div>

              <p className="mt-1 font-mono text-[10px] text-text-muted">
                explored {explored}/{result.visitedOrder.length}
              </p>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={restart}
        className="mt-6 border border-hairline px-3 py-1.5 font-mono text-xs hover:border-verified"
      >
        {running ? 'RUNNING…' : 'RACE AGAIN'}
      </button>
    </div>
  )
}
