const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  familyId: { type: Number, required: true },
  userId: { type: Number, required: true },
  title: String,
  description: String,
  photoUrl: { type: String, required: true },
  aiTags: [String],
  linkedBy: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', PhotoSchema);
