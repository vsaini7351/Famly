import { Notification } from "../models/notification.models.js"; // Mongo (Mongoose)
// import User from "../models/user.model.js"; // Postgres (Sequelize)
// import Family from "../models/family.model.js"; // Postgres (Sequelize)
import {User, Family,Membership } from "../models/index.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Privategroup } from "../models/privategroup.models.js";
import { NUMBER } from "sequelize";
import { Op } from "sequelize";

// ========== CREATE NOTIFICATION (manual) ==========
const createNotification = asyncHandler(async (req, res) => {
    console.log(req.body)
  const { type, title, message, meta, expiresAt } = req.body;

  const userId = Number(req.user.user_id)
  if (!userId || !type || !title || !message) {
    throw new ApiError(400, "userId, type, title and message are required");
  }

  const notif = await Notification.create({
    userId,
    type,
    title,
    message,
    status: "unread",
    meta: meta || {},
    expiresAt: expiresAt || null
  });

  return res
    .status(201)
    .json(new ApiResponse(201, notif, " Notification created successfully"));
});


// ========== GENERATE BIRTHDAY NOTIFICATIONS (family + groups) ==========
// const generateBirthdayNotifications = asyncHandler(async (req, res) => {
//   const today = new Date();
//   const todayMonth = today.getUTCMonth();
//   const todayDate = today.getUTCDate();

//   const users = await User.findAll(); // Sequelize (Postgres)
//   let createdNotifications = [];

//   for (let u of users) {
//     const dob = new Date(u.dob);
//     if (dob.getUTCMonth() === todayMonth && dob.getUTCDate() === todayDate) {
//       // 1️⃣ Notify the birthday person
//       const selfNotif = await Notification.create({
//         userId: u.user_id,
//         type: "birthday",
//         title: "Happy Birthday 🎂",
//         message: `Wishing you a wonderful birthday, ${u.fullname}!`,
//         status: "unread",
//         meta: { birthdayPerson: u.fullname }
//       });
//       createdNotifications.push(selfNotif);

//       // 2️⃣ Notify family members
//       const memberships = await Membership.findAll({
//         where: { family_id: { [Op.ne]: null } } // all families
//       });
//       const userFamilies = memberships.filter(m => m.user_id === u.user_id).map(m => m.family_id);

//       if (userFamilies.length > 0) {
//         const familyMembers = await Membership.findAll({
//           where: { family_id: userFamilies }
//         });
//         for (let fm of familyMembers) {
//           if (fm.user_id !== u.user_id) {
//             const famNotif = await Notification.create({
//               userId: fm.user_id,
//               type: "birthday",
//               title: "Birthday Reminder 🎂",
//               message: `Today is ${u.fullname}'s birthday! 🎉`,
//               status: "unread",
//               meta: { birthdayPerson: u.fullname }
//             });
//             createdNotifications.push(famNotif);
//           }
//         }
//       }

//       // 3️⃣ Notify private group members
//       const groups = await Privategroup.find({ "members.user_id": u.user_id });
//       for (let group of groups) {
//         for (let member of group.members) {
//           if (member.user_id !== u.user_id) {
//             const groupNotif = await Notification.create({
//               userId: member.user_id,
//               type: "birthday",
//               title: "Group Birthday Reminder 🎂",
//               message: `${u.fullname} (your group member) has a birthday today 🎉`,
//               status: "unread",
//               meta: { birthdayPerson: u.fullname, groupId: group._id }
//             });
//             createdNotifications.push(groupNotif);
//           }
//         }
//       }
//     }
//   }

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       { count: createdNotifications.length, notifications: createdNotifications },
//       "Birthday notifications generated"
//     )
//   );
// });

const generateBirthdayNotifications = asyncHandler(async (req, res) => {
  const today = new Date();
  const todayMonth = today.getMonth(); // local month
  const todayDate = today.getDate();   // local date

  const users = await User.findAll(); // all users
  const notifications = [];

  for (let user of users) {
    const dob = new Date(user.dob);
    if (dob.getMonth() === todayMonth && dob.getDate() === todayDate) {
      // 1️⃣ Notify the user themselves
      notifications.push({
        userId: user.user_id,
        type: "birthday",
        title: "Happy Birthday 🎂",
        message: `Wishing you a wonderful birthday, ${user.fullname}!`,
        status: "unread",
        meta: { birthdayPerson: user.fullname },
      });

      // 2️⃣ Notify family members
      const userMemberships = await Membership.findAll({
        where: { user_id: user.user_id },
      });
      const familyIds = userMemberships.map(m => m.family_id);

      if (familyIds.length > 0) {
        const familyMembers = await Membership.findAll({
          where: { family_id: familyIds },
        });

        familyMembers.forEach(fm => {
          if (fm.user_id !== user.user_id) {
            notifications.push({
              userId: fm.user_id,
              type: "birthday",
              title: "Birthday Reminder 🎂",
              message: `Today is ${user.fullname}'s birthday! 🎉`,
              status: "unread",
              meta: { birthdayPerson: user.fullname },
            });
          }
        });
      }

      // 3️⃣ Notify private group members
      const groups = await Privategroup.find({ "members.user_id": user.user_id });
      groups.forEach(group => {
        group.members.forEach(member => {
          if (member.user_id !== user.user_id) {
            notifications.push({
              userId: member.user_id,
              type: "birthday",
              title: "Group Birthday Reminder 🎂",
              message: `${user.fullname} (your group member) has a birthday today 🎉`,
              status: "unread",
              meta: { birthdayPerson: user.fullname, groupId: group._id },
            });
          }
        });
      });
    }
  }

  // Bulk insert all notifications at once
  const createdNotifications = await Notification.insertMany(notifications);

  return res.status(201).json({
    status: "success",
    count: createdNotifications.length,
    notifications: createdNotifications,
    message: "Birthday notifications generated",
  });
});


// ========== GENERATE ANNIVERSARY NOTIFICATIONS (family + groups) ==========
const generateAnniversaryNotifications = asyncHandler(async (req, res) => {
  const today = new Date();
  const todayMonth = today.getUTCMonth();
  const todayDate = today.getUTCDate();

  const families = await Family.findAll(); // Sequelize (Postgres)
  let createdNotifications = [];

  for (let fam of families) {
    const ann = new Date(fam.marriageDate);
    if (ann.getUTCMonth() === todayMonth && ann.getUTCDate() === todayDate) {
      // Notify family members
      const members = await Membership.findAll({ where: { family_id: fam.family_id } });
      for (let m of members) {
        const notif = await Notification.create({
          userId: m.user_id,
          type: "anniversary",
          title: "Anniversary Reminder 💍",
          message: `Today is ${fam.husbandName} & ${fam.wifeName}'s anniversary 🎉`,
          status: "unread",
          meta: { anniversaryCouple: `${fam.husbandName} & ${fam.wifeName}` }
        });
        createdNotifications.push(notif);
      }

      // Notify private groups of family creator
      const groups = await Privategroup.find({ "members.user_id": fam.createdBy });
      for (let group of groups) {
        for (let member of group.members) {
          const groupNotif = await Notification.create({
            userId: member.user_id,
            type: "anniversary",
            title: "Group Anniversary Reminder 💍",
            message: `${fam.husbandName} & ${fam.wifeName} are celebrating their anniversary today 🎉`,
            status: "unread",
            meta: { couple: `${fam.husbandName} & ${fam.wifeName}`, groupId: group._id }
          });
          createdNotifications.push(groupNotif);
        }
      }
    }
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { count: createdNotifications.length, notifications: createdNotifications },
      "Anniversary notifications generated"
    )
  );
});

//vansh check it out
// ========== CREATE MILESTONE NOTIFICATION ========== //
// const createMilestoneNotification = asyncHandler(async (req, res) => {
//   const { userId, milestoneName, message } = req.body;

//   if (!userId || !milestoneName || !message) {
//     throw new ApiError(400, "userId, milestoneName and message are required");
//   }

//   const notif = await Notification.create({
//     userId,
//     type: "milestone",
//     title: milestoneName,
//     message,
//     status: "unread",
//     meta: { milestoneName }
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, notif, " Milestone notification created"));
// });


// ========== GET USER NOTIFICATIONS ==========
const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1; // default page = 1
  const limit = 10; // fixed 10 notifications per page
  const skip = (page - 1) * limit;

  // Fetch notifications with pagination
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Count total notifications
  const totalCount = await Notification.countDocuments({ userId });
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      notifications,
      page,
      totalPages,
      totalCount
    }, "User notifications fetched")
  );
});



// ========== MARK ONE NOTIFICATION AS READ ==========
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notif = await Notification.findByIdAndUpdate(
    id,
    { status: "read" },
    { new: true }
  );

  if (!notif) throw new ApiError(404, "Notification not found");

  return res
    .status(200)
    .json(new ApiResponse(200, notif, " Notification marked as read"));
});


// ========== MARK ALL USER NOTIFICATIONS AS READ ==========
const markAllAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await Notification.updateMany(
    { userId, status: "unread" },
    { $set: { status: "read" } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, " All notifications marked as read"));
});


// ========== DELETE NOTIFICATION ==========
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notif = await Notification.findByIdAndDelete(id);
  if (!notif) throw new ApiError(404, "Notification not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, " Notification deleted successfully"));
});


// ✅ Export all controllers
export {
  createNotification,
  generateBirthdayNotifications,
  generateAnniversaryNotifications,
  
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
