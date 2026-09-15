import { useState } from 'react'
import { getLineCells, cellKey } from '@thinklab/word-search'

/**
 * Click-to-select rather than drag-to-select: click a start cell, then
 * click an end cell. This is deliberately more forgiving on mobile than
 * a drag gesture (no risk of the browser interpreting the drag as a
 * page scroll), and a mis-click just restarts the selection from the
 * new cell instead of showing an error.
 */
export default function WordSearchGrid({ grid, foundCells = [], onSelect, disabled = false }) {
  const [start, setStart] = useState(null)
  const [hover, setHover] = useState(null)

  const foundSet = new Set(foundCells.map(cellKey))
  const previewCells = start && hover ? getLineCells(start, hover) : null
  const previewSet = new Set((previewCells || []).map(cellKey))

  function handleClick(row, col) {
    if (disabled) return
    const cell = { row, col }

    if (!start) {
      setStart(cell)
      return
    }

    const cells = getLineCells(start, cell)
    if (cells && cells.length >= 2) {
      onSelect(start, cell)
      setStart(null)
      setHover(null)
    } else {
      // Not a straight line from the current start — treat this click as
      // the start of a fresh selection instead of erroring.
      setStart(cell)
    }
  }

  return (
    <div
      className="grid w-full max-w-full select-none gap-0.5"
      style={{ gridTemplateColumns: `repeat(${grid.size}, 1fr)` }}
    >
      {grid.letters.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey({ row: r, col: c })
          const isStart = start && start.row === r && start.col === c
          const isFound = foundSet.has(key)
          const isPreview = previewSet.has(key)

          let bg = 'transparent'
          if (isFound) bg = 'color-mix(in srgb, var(--color-verified) 25%, transparent)'
          else if (isStart) bg = 'color-mix(in srgb, var(--color-live) 35%, transparent)'
          else if (isPreview) bg = 'color-mix(in srgb, var(--color-live) 15%, transparent)'

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(r, c)}
              onMouseEnter={() => setHover({ row: r, col: c })}
              style={{ backgroundColor: bg }}
              className="flex aspect-square items-center justify-center border border-hairline/50 font-mono text-[9px] uppercase text-text hover:border-verified sm:text-xs"
            >
              {letter}
            </button>
          )
        }),
      )}
    </div>
  )
}
