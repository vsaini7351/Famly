import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPrivateGroup,
  joinPrivateGroup,
  getMyPrivateGroups,
  addGroupStory,
  getGroupDetails,
  removeMember,
  deletePrivateGroup,
  updatePrivateGroup,
  leavePrivateGroup
} from "../controllers/privategroup.controller.js";

const router = Router();

router.post("/private/create", verifyJWT, createPrivateGroup);
router.post("/private/join", verifyJWT, joinPrivateGroup);
router.get("/private/my-groups", verifyJWT, getMyPrivateGroups);
router.post("/private/:groupId/story", verifyJWT, addGroupStory);
router.get("/private/:groupId", verifyJWT, getGroupDetails);
router.delete("/private/:groupId/members/:memberId", verifyJWT, removeMember);
router.delete("/private/:groupId", verifyJWT, deletePrivateGroup);

// Update group details (owner only)
router.patch("/private/:groupId", verifyJWT, updatePrivateGroup);

// Leave group (for members)
router.post("/private/:groupId/leave", verifyJWT, leavePrivateGroup);

export default router;
