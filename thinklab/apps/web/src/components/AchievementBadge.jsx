import { ACHIEVEMENT_METADATA } from '@thinklab/shared'

export default function AchievementBadge({ type, issuedAt }) {
  const meta = ACHIEVEMENT_METADATA[type] || { label: type, description: '' }

  return (
    <div className="border border-hairline p-3">
      <p className="font-mono text-xs text-verified">{meta.label}</p>
      <p className="mt-1 text-xs text-text-muted">{meta.description}</p>
      {issuedAt && (
        <p className="mt-2 font-mono text-[10px] text-text-muted">
          {new Date(issuedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
