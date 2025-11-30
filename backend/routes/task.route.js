import express from "express";
import { adminOnly, verifyToken } from "../utils/verifyUser.js";
import {
    createTask,
    deleteTask,
    getDashboardData,
    getTaskById,
    getTasks,
    updateTask,
    updateTaskChecklist,
    updateTaskStatus,
    userDashboardData,
} from "../controller/task.controller.js";

const router = express.Router();

router.post("/create", verifyToken, adminOnly, createTask);

router.get("/", verifyToken, getTasks);

router.get("/dashboard-data", verifyToken, adminOnly, getDashboardData);

router.get("/user-dashboard-data", verifyToken, userDashboardData);

router.get("/:id", verifyToken, getTaskById);

router.put("/:id", verifyToken, updateTask);

router.delete("/:id", verifyToken, adminOnly, deleteTask);

router.put("/:id/status", verifyToken, updateTaskStatus);

router.put("/:id/todo", verifyToken, updateTaskChecklist);

export default router;
