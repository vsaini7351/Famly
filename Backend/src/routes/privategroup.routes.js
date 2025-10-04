import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPrivateGroup,
  joinPrivateGroup,
  getMyPrivateGroups,
  addGroupStory,
  getGroupStories,
  getGroupDetails,
  removeMember,
  leavePrivateGroup,
  updatePrivateGroup,
  deletePrivateGroup,
  removeGroupStory
} from "../controllers/privategroup.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// ---------------- GROUP ROUTES ---------------- //

// Create a group
router.post("/create", verifyJWT, createPrivateGroup);

// Join a group using inviteCode
router.post("/join", verifyJWT, joinPrivateGroup);

// Get all groups where logged-in user is a member
router.get("/my", verifyJWT, getMyPrivateGroups);

// Get group details
router.get("/:groupId", verifyJWT, getGroupDetails);

// Update group details (owner only)
router.patch("/:groupId", verifyJWT, updatePrivateGroup);

// Delete a group (owner only)
router.delete("/:groupId", verifyJWT, deletePrivateGroup);

// ---------------- MEMBER ROUTES ---------------- //


// Remove a member (owner only)
router.delete("/:groupId/members", verifyJWT, removeMember);

// Leave group (for members)
router.delete("/:groupId/members/me", verifyJWT, leavePrivateGroup);



// ---------------- STORY ROUTES ---------------- //

// Add a new story to group
router.post("/:groupId/stories", verifyJWT,upload.single("file"),  addGroupStory);

// Get stories with pagination
router.get("/:groupId/stories", verifyJWT, getGroupStories);

router.delete("/:groupId/stories/:storyId",verifyJWT,removeGroupStory);

export default router;
