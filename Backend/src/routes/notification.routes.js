import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createNotification,
  generateBirthdayNotifications,
  generateAnniversaryNotifications,
  
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notification.controller.js";

const router = Router();
router.post("/notification/create", verifyJWT, createNotification);
router.post("/notification/generate/birthdays", generateBirthdayNotifications);
router.post("/notification/generate/anniversaries", generateAnniversaryNotifications);
router.get("/notification/user", verifyJWT, getUserNotifications);
router.patch("/notification/:id/read", verifyJWT, markAsRead);
router.patch("/notification/user/:userId/read-all", verifyJWT, markAllAsRead);
router.delete("/notification/:id", verifyJWT, deleteNotification);

export default router;
