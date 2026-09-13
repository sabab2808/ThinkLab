const STATES = [null, 'X', 'O']

export default function MarkReviewGrid({ cells, onChange }) {
  function cycle(index) {
    const current = cells[index]
    const next = STATES[(STATES.indexOf(current) + 1) % STATES.length]
    onChange(index, next)
  }

  return (
    <div className="grid w-full max-w-72 grid-cols-3 gap-1.5 sm:gap-2">
      {cells.map((cell, i) => (
        <button
          key={i}
          type="button"
          onClick={() => cycle(i)}
          className="flex aspect-square items-center justify-center border border-hairline font-display text-2xl hover:border-verified"
        >
          {cell}
        </button>
      ))}
    </div>
  )
}
