import express from "express";
import { verifyToken, adminOnly } from "../utils/verifyUser.js";
import { markAttendance, getAttendanceRecords } from "../controller/attendance.controller.js";

const router = express.Router();

// Admin route to mark attendance
router.post("/mark", verifyToken, adminOnly, markAttendance);

// Shared route to get attendance records (filtered by user role/query)
router.get("/", verifyToken, getAttendanceRecords);

export default router;