import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { getUserById, getUsers } from "../controller/user.controller.js";

const router = express.Router();

router.get("/get-users", verifyToken, verifyWorkspace, authorizeRoles("Admin", "Manager"), getUsers);

router.get("/:id", verifyToken, getUserById);

export default router;
