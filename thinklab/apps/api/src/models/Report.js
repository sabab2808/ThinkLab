import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', default: null },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'reviewing', 'resolved', 'dismissed'],
    default: 'open',
  },
  moderatorNote: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
})

export const Report = mongoose.model('Report', reportSchema)
