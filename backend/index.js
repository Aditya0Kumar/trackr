import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import reportRoutes from "./routes/report.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import attendanceRoutes from "./routes/attendance.route.js"; // Import attendance routes
import rectificationRoutes from "./routes/rectification.route.js"; // Import rectification routes
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database is connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(
    cors({
        origin: process.env.FRONT_END_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance", attendanceRoutes); // Use attendance routes
app.use("/api/rectifications", rectificationRoutes); // Use rectification routes

app.use("/assets/uploads", express.static(path.join(__dirname, "assets/uploads")));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});