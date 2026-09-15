export default function MazeIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="8" y="8" width="48" height="48" stroke="var(--color-hairline)" strokeWidth="2" />
      <g stroke="var(--color-hairline)" strokeWidth="2">
        <line x1="8" y1="20" x2="32" y2="20" />
        <line x1="20" y1="32" x2="56" y2="32" />
        <line x1="8" y1="44" x2="32" y2="44" />
        <line x1="44" y1="8" x2="44" y2="20" />
      </g>
      <path
        d="M14 14 L14 26 L26 26 L26 38 L14 38 L14 50 L38 50 L38 26 L50 26 L50 14"
        stroke="var(--color-pathfinding)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14" cy="14" r="2.5" fill="var(--color-pathfinding)" />
      <circle cx="50" cy="14" r="2.5" fill="var(--color-pathfinding)" />
    </svg>
  )
}
