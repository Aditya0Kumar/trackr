import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { getRectificationAttempts } from "../controller/rectification.controller.js";

const router = express.Router();

router.get("/attempts", verifyToken, verifyWorkspace, authorizeRoles("Admin"), getRectificationAttempts);

export default router;