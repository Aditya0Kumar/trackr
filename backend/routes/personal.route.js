
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getMyTasks, getMyAttendance, getMyDashboardStats } from "../controller/personal.controller.js";

const router = express.Router();

// All personal routes require a valid user token, but NO workspace verification
router.use(verifyToken);

router.get("/tasks", getMyTasks);
router.get("/attendance", getMyAttendance);
router.get("/dashboard", getMyDashboardStats);

export default router;
