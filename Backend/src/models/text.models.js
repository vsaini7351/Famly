const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  familyId: { type: Number, required: true },
  userId: { type: Number, required: true },
  title: String,
  content: { type: String, required: true },
  aiTags: [String],
  linkedBy: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Text', TextSchema);
