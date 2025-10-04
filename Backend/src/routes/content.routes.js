// routes/content.routes.js
import express from "express";
import {
  createStory,
  deleteStory,
  likeStory,
  unlikeStory,
  getFamilyStoriesAsc,
  getFamilyStoriesDesc,
  updateStory,
  getStory,
  getRecentStories,
  getUserRecentStories,
  searchStories,
} from "../controllers/content.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --------------------
// ✅ Static Routes First
// --------------------
router.post(
  "/create-story/:family_id",
  verifyJWT,
  upload.array("mediaFiles", 10), // Accept up to 10 files
  createStory
);

router.delete("/delete/:storyId", verifyJWT, deleteStory);
router.post("/like/:storyId", verifyJWT, likeStory);
router.post("/unlike/:storyId", verifyJWT, unlikeStory);

router.get("/recent-story", verifyJWT, getRecentStories);
router.get("/timeline-story", verifyJWT, getUserRecentStories);

router.get("/family/:familyId/asc", verifyJWT, getFamilyStoriesAsc);
router.get("/family/:familyId/desc", verifyJWT, getFamilyStoriesDesc);

router.put("/update/:storyId", verifyJWT, updateStory);

// --------------------
// ❗️Dynamic Route Last
// --------------------
router.get("/:storyId", verifyJWT, getStory);

router.get("/:family_id/search",searchStories)

export default router;
