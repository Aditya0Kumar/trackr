import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import {
    exportTaskReport,
    exportUsersReport,
} from "../controller/report.controller.js";

const router = express.Router();

router.get("/export/tasks", verifyToken, verifyWorkspace, authorizeRoles("Admin"), exportTaskReport);

router.get("/export/users", verifyToken, verifyWorkspace, authorizeRoles("Admin"), exportUsersReport);

export default router;
