import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String, 
    required: true
  },
  description: String,

  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  family_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true
  },

  liked_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Story", storySchema);
