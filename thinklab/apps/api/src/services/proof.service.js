import crypto from 'crypto'
import { Proof } from '../models/Proof.js'

export function generateProofId() {
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `TL-${suffix}`
}

export async function issueProof(resultId) {
  return Proof.create({ result: resultId, proofId: generateProofId() })
}
