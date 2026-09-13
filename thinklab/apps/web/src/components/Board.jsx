/**
 * Renders a 3x3 board. Fully fluid: sizes from the parent's width via
 * `max-w`, not fixed pixel dimensions, so it scales down cleanly on
 * narrow phone screens instead of overflowing.
 */
export default function Board({ cells, onCellClick, size = 'lg' }) {
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl'

  return (
    <div className="grid w-full max-w-72 grid-cols-3 gap-1.5 sm:gap-2">
      {cells.map((cell, i) => {
        const interactive = Boolean(onCellClick)
        const Tag = interactive ? 'button' : 'div'
        return (
          <Tag
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onCellClick(i) : undefined}
            disabled={interactive ? Boolean(cell) : undefined}
            className={
              `flex aspect-square items-center justify-center border border-hairline font-display ${textSize} ` +
              (interactive ? 'hover:border-verified disabled:cursor-not-allowed' : '')
            }
          >
            {cell}
          </Tag>
        )
      })}
    </div>
  )
}
