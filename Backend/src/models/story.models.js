import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'audio', 'text'], required: true },
  url: { type: String },    // for image, video, audio
  text: { type: String },   // for text content
  order: { type: Number }   // optional ordering
}, { _id: false });

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String },
  
  // References to PostgreSQL entities
  uploaded_by: { type: Number, required: true }, // PostgreSQL user_id
  family_id: { type: Number, required: true },   // PostgreSQL family_id
  
  media: [mediaSchema],
  liked_by: [{ type: Number }] // PostgreSQL user IDs who liked
}, { timestamps: true });

// Index for timeline queries
storySchema.index({ family_id: 1, createdAt: -1 });

export default mongoose.model("Story", storySchema);
