import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addCommentToTask } from "../controller/comment.controller.js";

const router = express.Router();


router.post("/task/:id", verifyToken, addCommentToTask);

export default router;