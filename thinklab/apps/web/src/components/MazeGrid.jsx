const WALL = '2px solid var(--color-hairline)'
const OPEN = '2px solid transparent'

function cellStyle(cell) {
  return {
    borderTop: cell.N ? WALL : OPEN,
    borderRight: cell.E ? WALL : OPEN,
    borderBottom: cell.S ? WALL : OPEN,
    borderLeft: cell.W ? WALL : OPEN,
  }
}

/**
 * Renders a maze. Fully fluid (percentage-based grid, no fixed pixel
 * sizes) so it scales down on narrow screens the same way Board.jsx does
 * for Tic-Tac-Toe.
 *
 * `visited` and `path` are arrays of {x,y}; `playerPos` is a single
 * {x,y} or null. `onCellClick(x,y)` is optional — omit it for read-only
 * boards (algorithm race panels, replay scrubbing).
 */
export default function MazeGrid({ maze, visited = [], path = [], playerPos = null, onCellClick, compact = false }) {
  const visitedSet = new Set(visited.map((c) => `${c.x},${c.y}`))
  const pathSet = new Set(path.map((c) => `${c.x},${c.y}`))

  return (
    <div
      className="grid w-full max-w-96"
      style={{ gridTemplateColumns: `repeat(${maze.width}, 1fr)` }}
    >
      {maze.grid.map((row, y) =>
        row.map((cell, x) => {
          const key = `${x},${y}`
          const isStart = x === maze.start.x && y === maze.start.y
          const isEnd = x === maze.end.x && y === maze.end.y
          const isPlayer = playerPos && playerPos.x === x && playerPos.y === y
          const onPath = pathSet.has(key)
          const wasVisited = visitedSet.has(key)

          let bg = 'transparent'
          if (onPath) bg = 'color-mix(in srgb, var(--color-verified) 22%, transparent)'
          else if (wasVisited) bg = 'color-mix(in srgb, var(--color-live) 16%, transparent)'

          return (
            <button
              key={key}
              type="button"
              onClick={onCellClick ? () => onCellClick(x, y) : undefined}
              disabled={!onCellClick}
              style={{ ...cellStyle(cell), backgroundColor: bg }}
              className={
                'flex aspect-square items-center justify-center font-mono ' +
                (compact ? 'text-[8px]' : 'text-[10px] sm:text-xs') +
                (onCellClick ? ' cursor-pointer' : ' cursor-default')
              }
            >
              {isPlayer ? (
                <span className="h-1.5 w-1.5 rounded-full bg-verified sm:h-2 sm:w-2" />
              ) : isStart ? (
                <span className="text-text-muted">S</span>
              ) : isEnd ? (
                <span className="text-text-muted">E</span>
              ) : null}
            </button>
          )
        }),
      )}
    </div>
  )
}
