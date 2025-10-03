import mongoose, { Schema } from "mongoose";

// Private group schema
const privategroupSchema = new Schema({
    groupId: { 
        type: String, 
        required: true 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },
    inviteCode: {
        type: String,
        unique: true,   // no two groups have the same code
        index: true     // quick lookup when joining
    },

    isPrivate: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
        user: { 
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true },
        role: {
            type: String,
            enum: ["owner", "member"],
            default: "member"
        },
        joinedAt: { 
            type: Date, 
            default: Date.now 
        }
        }
    ],

    story: [{
        type: {
            type: String,
            enum: ["text", "image", "video", "audio", "file"],
            required: true
        },
        text: String,
        url: String,   
        mimeType: String,
        size: Number,
        createdBy: { 
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });


export const Privategroup = mongoose.model("Privategroup", privategroupSchema);
