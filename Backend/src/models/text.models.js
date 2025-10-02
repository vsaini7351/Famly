import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },

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

export default mongoose.model("Text", textSchema);
