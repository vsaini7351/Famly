import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"   

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String 
  },
  dob: { 
    type: Date 
  },
  age: { 
    type: Number 
  },
  interests: [{ 
    type: String 
  }],
  profilePhoto: { 
    type: String 
  },


  families: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Family" }
  ],

  // ✅ User Timeline: refs to story, video, text
  timeline: [
    {
      itemType: { 
        type: String, 
        enum: ["Story", "Video", "Text"], 
        required: true 
      },
      refId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: "timeline.itemType" 
        // refPath makes it dynamic → can point to Story, Video, or Text
      },
      uploadedAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("User", userSchema);
