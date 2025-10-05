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
  memory_date: { type: Date, default: Date.now },
  tags: [{type: String,lowercase:true}],
  
  // References to PostgreSQL entities
  uploaded_by: { type: Number, required: true,index:true }, // PostgreSQL user_id
  family_id: { type: Number, required: true },   // PostgreSQL family_id
  
  media: [mediaSchema],
  liked_by: { type: [Number], default: [] } // PostgreSQL user IDs who liked
}, { timestamps: true });

// Index for timeline queries
storySchema.index({ family_id: 1, createdAt: -1 });
storySchema.index({ memory_date: 1 });  // ascending
storySchema.index({ memory_date: -1 }); // descending
storySchema.index({ tags: 1 }); 


export const Story= mongoose.model("Story", storySchema);
