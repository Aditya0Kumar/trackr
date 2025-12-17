import express from "express";
import { verifyToken, adminOnly } from "../utils/verifyUser.js";
import { getRectificationAttempts } from "../controller/rectification.controller.js";

const router = express.Router();

router.get("/attempts", verifyToken, adminOnly, getRectificationAttempts);

export default router;