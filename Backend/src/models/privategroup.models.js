import mongoose, { Schema } from "mongoose";

const privategroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index:true
  },

  description: {
    type: String,
    trim: true
  },

  inviteCode: {
    type: String,
    unique: true,
    index: true
  },

  isPrivate: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: Number, // PostgreSQL user_id
    required: true
  },

  members: [
    {
      _id: false,
      user_id: { type: Number, required: true }, // Postgres ID
      role: {
        type: String,
        enum: ["owner", "member"],
        default: "member"
      },
      joinedAt: { type: Date, default: Date.now }
    }
  ],

  story: [
    {
      contentType: {
        type: String,
        enum: ["text", "image", "video", "audio", "file"],
        required: true
      },
      text: String,
      url: String,
      mimeType: String,
      size: Number,
      createdBy: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

// Helpful index: find groups by member
privategroupSchema.index({ "members.user_id": 1 });

export const Privategroup = mongoose.model("Privategroup", privategroupSchema);
