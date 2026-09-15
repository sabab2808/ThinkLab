export default function TicTacToeIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <g stroke="var(--color-hairline)" strokeWidth="2">
        <line x1="22" y1="8" x2="22" y2="56" />
        <line x1="42" y1="8" x2="42" y2="56" />
        <line x1="8" y1="22" x2="56" y2="22" />
        <line x1="8" y1="42" x2="56" y2="42" />
      </g>
      <g stroke="var(--color-strategy)" strokeWidth="3" strokeLinecap="round">
        <line x1="12" y1="12" x2="18" y2="18" />
        <line x1="18" y1="12" x2="12" y2="18" />
      </g>
      <circle cx="32" cy="32" r="6" stroke="var(--color-strategy)" strokeWidth="3" opacity="0.55" />
      <g stroke="var(--color-strategy)" strokeWidth="3" strokeLinecap="round">
        <line x1="46" y1="46" x2="52" y2="52" />
        <line x1="52" y1="46" x2="46" y2="52" />
      </g>
    </svg>
  )
}
