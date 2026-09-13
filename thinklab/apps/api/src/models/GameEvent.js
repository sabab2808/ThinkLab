import mongoose from 'mongoose'

const gameEventSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', required: true },
  sequenceNo: { type: Number, required: true },
  eventType: { type: String, required: true }, // e.g. 'move', 'undo', 'forfeit'
  eventData: { type: mongoose.Schema.Types.Mixed, required: true },
  serverTimestamp: { type: Date, default: Date.now },
})

// A session's events must have unique, contiguous sequence numbers — this
// index makes a duplicate or replayed sequence number a write-time error
// instead of something the verification engine has to catch after the fact.
gameEventSchema.index({ session: 1, sequenceNo: 1 }, { unique: true })

export const GameEvent = mongoose.model('GameEvent', gameEventSchema)
