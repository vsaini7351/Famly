import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  userId: {
    type: Number, // receiver of the notification
    required: true,
  },

  type: {
    type: String,
    enum: ["birthday", "anniversary", "general", "comment","like", "story"],
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    required: true,
  },

  link: {
    type: String, // optional: redirect to story, group, or milestone page
    default: null,
  },

  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },

  meta: {
    // store extra details depending on type
    birthdayPerson: { type: String },  // for birthdays
    anniversaryCouple: { type: String }, // for anniversaries
    milestoneName: { type: String },   // for milestone (e.g. "100 stories")
    storyId: { type: String },         // for story notifications
    commentId: { type: String },       // for comment notifications
    groupId: { type: String }, 
    fromUserId: { type: Number }, 
    groupNotificationId : {type :Number},        // optional: link to group
  },

  expiresAt: {
    type: Date, // optional: reminders can expire
  }

}, { timestamps: true });  // createdAt, updatedAt

export const Notification = mongoose.model("Notification", notificationSchema);
