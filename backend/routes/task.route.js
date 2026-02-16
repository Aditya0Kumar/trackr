import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
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
    verifyTaskChecklistItem,
    unarchiveTask, // Import new function
} from "../controller/task.controller.js";

const router = express.Router();

// 1. Personal Dashboard Route - Bypasses Workspace Middleware
// router.get("/personal-dashboard-data",verifyToken, getPersonalDashboardData);

// 2. Specific Workspace Routes (Must come BEFORE generic /:id)
router.get("/dashboard-data", verifyToken, verifyWorkspace, getDashboardData);

router.get("/user-dashboard-data", verifyToken, verifyWorkspace, userDashboardData);

// 3. Global Task Access (Task Details) - Matches /:id, so must be after specific strings
// Does NOT use verifyWorkspace automatically (handles own logic)
router.get("/:id", verifyToken, getTaskById);

// 4. Apply verification and workspace middleware to all other/subsequent task routes
router.use(verifyToken, verifyWorkspace);

router.post("/create", authorizeRoles("Admin", "Manager"), createTask);

router.get("/", getTasks);

router.put("/:id", authorizeRoles("Admin", "Manager"), updateTask);

router.delete("/:id", authorizeRoles("Admin"), deleteTask); // Archive task

router.put("/:id/unarchive", authorizeRoles("Admin"), unarchiveTask); // Unarchive task

router.put("/:id/status", updateTaskStatus);

router.put("/:id/todo", updateTaskChecklist);

router.put("/:id/todo/verify", authorizeRoles("Admin", "Manager"), verifyTaskChecklistItem);

export default router;