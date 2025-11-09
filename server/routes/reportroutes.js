import express from "express";
import { createReport, getAllReports } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, upload.array("images"), createReport)
  .get(protect, getAllReports);

export default router;