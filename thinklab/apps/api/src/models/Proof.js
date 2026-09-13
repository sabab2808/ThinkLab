import mongoose from 'mongoose'

const proofSchema = new mongoose.Schema({
  result: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true, unique: true },
  proofId: { type: String, required: true, unique: true }, // public id, e.g. TL-8F72A91C
  publicStatus: { type: String, enum: ['public', 'private'], default: 'public' },
  createdAt: { type: Date, default: Date.now },
})

export const Proof = mongoose.model('Proof', proofSchema)
