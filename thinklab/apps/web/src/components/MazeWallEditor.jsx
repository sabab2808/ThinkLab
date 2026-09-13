const WALL_COLOR = 'var(--color-hairline)'
const OPEN_COLOR = 'transparent'

export default function MazeWallEditor({ grid, onToggle }) {
  const height = grid.length
  const width = grid[0].length

  return (
    <div
      className="grid w-full max-w-96"
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div key={`${x},${y}`} className="relative aspect-square">
            {/* Cell body, shows current wall state as borders */}
            <div
              className="absolute inset-0"
              style={{
                borderTop: `2px solid ${cell.N ? WALL_COLOR : OPEN_COLOR}`,
                borderBottom: `2px solid ${cell.S ? WALL_COLOR : OPEN_COLOR}`,
                borderLeft: `2px solid ${cell.W ? WALL_COLOR : OPEN_COLOR}`,
                borderRight: `2px solid ${cell.E ? WALL_COLOR : OPEN_COLOR}`,
              }}
            />
            {/* Clickable strips on each edge, toggling that wall */}
            <button
              type="button"
              aria-label="toggle north wall"
              onClick={() => onToggle(x, y, 'N')}
              className="absolute inset-x-0 top-0 h-2"
            />
            <button
              type="button"
              aria-label="toggle south wall"
              onClick={() => onToggle(x, y, 'S')}
              className="absolute inset-x-0 bottom-0 h-2"
            />
            <button
              type="button"
              aria-label="toggle west wall"
              onClick={() => onToggle(x, y, 'W')}
              className="absolute inset-y-0 left-0 w-2"
            />
            <button
              type="button"
              aria-label="toggle east wall"
              onClick={() => onToggle(x, y, 'E')}
              className="absolute inset-y-0 right-0 w-2"
            />
          </div>
        )),
      )}
    </div>
  )
}
