const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  familyId: { type: Number, required: true },
  userId: { type: Number, required: true },
  title: String,
  description: String,
  videoUrl: { type: String, required: true },
  metadata: { durationSec: Number, resolution: String },
  aiTags: [String],
  linkedBy: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);
