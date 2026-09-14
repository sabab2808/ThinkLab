import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bfs, dfs, dijkstra, astar } from '@thinklab/algorithms'
import MazeCapture from '../../components/MazeCapture.jsx'
import MazeWallEditor from '../../components/MazeWallEditor.jsx'
import MazeGrid from '../../components/MazeGrid.jsx'

const OPPOSITE = { N: 'S', S: 'N', E: 'W', W: 'E' }
const DELTA = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }

function toggleWall(grid, x, y, dir) {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })))
  next[y][x][dir] = !next[y][x][dir]
  const [dx, dy] = DELTA[dir]
  const nx = x + dx
  const ny = y + dy
  if (ny >= 0 && ny < next.length && nx >= 0 && nx < next[0].length) {
    next[ny][nx][OPPOSITE[dir]] = next[y][x][dir]
  }
  return next
}

const ALGORITHMS = { BFS: bfs, DFS: dfs, Dijkstra: dijkstra, 'A*': astar }

export default function MazeLabScan() {
  const [dims, setDims] = useState({ width: 8, height: 8 })
  const [stage, setStage] = useState('dimensions') // dimensions | capture | review | solved
  const [grid, setGrid] = useState(null)
  const [algorithm, setAlgorithm] = useState('BFS')

  function startCapture() {
    setStage('capture')
  }

  function handleCapture(scannedGrid) {
    setGrid(scannedGrid)
    setStage('review')
  }

  function handleToggle(x, y, dir) {
    setGrid((g) => toggleWall(g, x, y, dir))
  }

  const maze = grid
    ? { width: dims.width, height: dims.height, grid, start: { x: 0, y: 0 }, end: { x: dims.width - 1, y: dims.height - 1 } }
    : null
  const result = maze ? ALGORITHMS[algorithm](maze, maze.start, maze.end) : null
  const solvable = result ? result.path.length > 0 : false

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-mono text-xs text-text-muted">pathfinding · scan</p>
      <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Scan a maze</h1>
      <p className="mt-2 text-sm text-text-muted sm:text-base">
        Photograph a hand-drawn or printed maze and get it solved.
      </p>

      {stage === 'dimensions' && (
        <div className="mt-6">
          <div className="flex items-end gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              Columns
              <input
                type="number"
                min={3}
                max={15}
                value={dims.width}
                onChange={(e) => setDims((d) => ({ ...d, width: Number(e.target.value) }))}
                className="w-20 border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Rows
              <input
                type="number"
                min={3}
                max={15}
                value={dims.height}
                onChange={(e) => setDims((d) => ({ ...d, height: Number(e.target.value) }))}
                className="w-20 border border-hairline bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-verified"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={startCapture}
            className="mt-6 border border-hairline px-4 py-2 text-sm hover:border-verified"
          >
            Continue to camera
          </button>
        </div>
      )}

      {stage === 'capture' && (
        <div className="mt-6">
          <p className="text-sm text-text-muted">
            Align your maze inside the grid guide (start top-left, finish bottom-right), then capture.
          </p>
          <div className="mt-4">
            <MazeCapture width={dims.width} height={dims.height} onCapture={handleCapture} />
          </div>
        </div>
      )}

      {(stage === 'review' || stage === 'solved') && grid && (
        <div className="mt-6">
          <p className="text-sm text-text-muted">
            Tap any edge to add or remove a wall — the scan won't always be perfect.
          </p>
          <div className="mt-4 max-w-96">
            <MazeWallEditor grid={grid} onToggle={handleToggle} />
          </div>

          {!solvable && (
            <p className="mt-4 font-mono text-xs text-danger">
              No path found from start to finish with the current walls — fix a wall above.
            </p>
          )}

          {solvable && (
            <div className="mt-8 border-t border-hairline pt-6">
              <div className="flex flex-wrap gap-2">
                {Object.keys(ALGORITHMS).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setAlgorithm(name)}
                    className={
                      'border px-2 py-1 font-mono text-xs ' +
                      (algorithm === name ? 'border-verified text-verified' : 'border-hairline text-text-muted')
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-mono text-xs text-verified">
                solved in {result.path.length - 1} moves
              </p>
              <div className="mt-4 max-w-96">
                <MazeGrid maze={maze} path={result.path} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStage('dimensions')}
            className="mt-8 border border-hairline px-4 py-2 text-sm hover:border-verified"
          >
            Scan another maze
          </button>
        </div>
      )}

      <p className="mt-10 text-xs text-text-muted">
        Wall detection is a darkness-threshold heuristic on the photo, not a trained model —
        always check the grid above before trusting the solution.{' '}
        <Link to="/games/maze" className="text-verified hover:underline">
          Play the generated Maze Lab instead
        </Link>
      </p>
    </main>
  )
}
