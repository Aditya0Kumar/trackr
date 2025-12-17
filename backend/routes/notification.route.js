import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getNotifications, markAsRead } from "../controller/notification.controller.js";

const router = express.Router();

// GET /api/notifications
router.get("/", verifyToken, getNotifications);

// PUT /api/notifications/read
router.put("/read", verifyToken, markAsRead);

export default router;