export default function CubeIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {/* top face */}
      <g stroke="var(--color-hairline)" strokeWidth="1.5">
        <polygon points="32,8 54,20 32,32 10,20" fill="color-mix(in srgb, var(--color-optimization) 30%, transparent)" />
        <line x1="21" y1="14" x2="43" y2="26" />
        <line x1="43" y1="14" x2="21" y2="26" />
      </g>
      {/* left face */}
      <g stroke="var(--color-hairline)" strokeWidth="1.5">
        <polygon points="10,20 32,32 32,56 10,44" fill="color-mix(in srgb, var(--color-optimization) 15%, transparent)" />
        <line x1="10" y1="28" x2="32" y2="40" />
        <line x1="10" y1="36" x2="32" y2="48" />
        <line x1="17.3" y1="24" x2="17.3" y2="48" />
        <line x1="24.6" y1="28" x2="24.6" y2="52" />
      </g>
      {/* right face */}
      <g stroke="var(--color-hairline)" strokeWidth="1.5">
        <polygon points="54,20 32,32 32,56 54,44" fill="color-mix(in srgb, var(--color-optimization) 45%, transparent)" />
        <line x1="54" y1="28" x2="32" y2="40" />
        <line x1="54" y1="36" x2="32" y2="48" />
        <line x1="46.6" y1="24" x2="46.6" y2="48" />
        <line x1="39.3" y1="28" x2="39.3" y2="52" />
      </g>
    </svg>
  )
}
