import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { markAttendance, getAttendanceRecords } from "../controller/attendance.controller.js";

const router = express.Router();

router.post("/mark", verifyToken, verifyWorkspace, authorizeRoles("Admin"), markAttendance);

// Shared route to get attendance records (filtered by user role/query) - ADDED WORKSPACE CHECK
router.get("/", verifyToken, verifyWorkspace, getAttendanceRecords);

export default router;