import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyWorkspace } from "../middleware/workspace.middleware.js";
import {
    getPersonalConversations,
    createPersonalConversation,
    getMessages,
    sendMessage,
    getWorkspaceGroupConversation,
    markMessageAsRead,
} from "../controller/chat.controller.js";

const router = express.Router();

// Personal Chat Routes
router.get("/personal", verifyToken, getPersonalConversations);
router.post("/personal", verifyToken, createPersonalConversation);
router.post("/personal/start", verifyToken, createPersonalConversation); // Alias for bootstrapping

// Workspace Chat Routes
router.get("/workspace/group/:groupId", verifyToken, verifyWorkspace, getWorkspaceGroupConversation);

// Message Routes
router.get("/messages/:conversationId", verifyToken, getMessages);
router.post("/messages/:conversationId", verifyToken, sendMessage);
router.put("/read", verifyToken, markMessageAsRead);

export default router;
