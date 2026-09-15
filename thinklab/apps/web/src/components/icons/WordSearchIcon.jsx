const LETTERS = [
  ['t', 'h', 'i', 'n'],
  ['q', 'k', 'z', 'x'],
  ['w', 'r', 'e', 'a'],
  ['j', 'v', 'b', 'g'],
]

export default function WordSearchIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="8" y="8" width="48" height="48" stroke="var(--color-hairline)" strokeWidth="2" />
      {LETTERS.map((row, r) =>
        row.map((letter, c) => (
          <text
            key={`${r}-${c}`}
            x={8 + c * 12 + 6}
            y={8 + r * 12 + 8}
            fontSize="7"
            fontFamily="ui-monospace, monospace"
            fill="var(--color-text-muted)"
            textAnchor="middle"
          >
            {letter}
          </text>
        )),
      )}
      <line x1="14" y1="14" x2="50" y2="50" stroke="var(--color-vocabulary)" strokeWidth="7" strokeLinecap="round" opacity="0.35" />
      <text x="14" y="16" fontSize="7" fontFamily="ui-monospace, monospace" fill="var(--color-vocabulary)" textAnchor="middle">t</text>
      <text x="26" y="28" fontSize="7" fontFamily="ui-monospace, monospace" fill="var(--color-vocabulary)" textAnchor="middle">h</text>
      <text x="38" y="40" fontSize="7" fontFamily="ui-monospace, monospace" fill="var(--color-vocabulary)" textAnchor="middle">e</text>
      <text x="50" y="52" fontSize="7" fontFamily="ui-monospace, monospace" fill="var(--color-vocabulary)" textAnchor="middle">m</text>
    </svg>
  )
}
