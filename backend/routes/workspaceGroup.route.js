import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { createGroup, getGroups } from "../controller/workspaceGroup.controller.js";

const router = express.Router();

// Apply workspace verification to all routes
router.use(verifyToken, verifyWorkspace);

router.post("/", authorizeRoles("Admin", "Manager"), createGroup);
router.get("/", getGroups);

export default router;
