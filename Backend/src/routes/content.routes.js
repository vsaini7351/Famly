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
} from "../controllers/content.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();




router.post(
  "/create-story",
  verifyJWT,
  upload.array("mediaFiles", 10), // Accept up to 10 files
  createStory
);


router.delete("/delete/:storyId", verifyJWT, deleteStory);


router.post("/like/:storyId", verifyJWT, likeStory);
router.post("/unlike/:storyId", verifyJWT, unlikeStory);


router.get("/:storyId", verifyJWT, getStory);


router.put("/update/:storyId", verifyJWT, updateStory);


router.get("/family/:familyId/asc", verifyJWT, getFamilyStoriesAsc);
router.get("/family/:familyId/desc", verifyJWT, getFamilyStoriesDesc);


router.get("/recent-story", verifyJWT, getRecentStories);


router.get("/timeline-story", verifyJWT, getUserRecentStories);

export default router;
