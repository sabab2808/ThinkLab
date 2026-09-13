// Generates a client-side placeholder proof id, formatted like the real
// thing (docs/verification.md: TL-XXXXXXXX). Once the server exists, the
// real proof_hash from the `proofs` table replaces this entirely — this
// only exists so the UI has something to show before that's wired up.
export function generateProofId() {
  const chars = '0123456789ABCDEF'
  let suffix = ''
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `TL-${suffix}`
}
