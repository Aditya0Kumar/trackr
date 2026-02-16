import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import reportRoutes from "./routes/report.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import rectificationRoutes from "./routes/rectification.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import personalRoutes from "./routes/personal.route.js";
import chatRoutes from "./routes/chat.route.js"; // Import chat routes
import workspaceGroupRoutes from "./routes/workspaceGroup.route.js";
import { initSocket } from "./socket/socket.js";
import "./config/redis.js"; // Initialize Redis
import { globalLimiter, authLimiter, chatLimiter } from "./middleware/rateLimit.middleware.js";

// ... (existing imports)

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
const server = http.createServer(app);
initSocket(server);

app.use(
    cors({
        origin: process.env.FRONT_END_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "x-workspace-id"],
    })
);

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});

// Trust Proxy for Rate Limiting (Required for deployment behind proxies like Vercel/Railway)
app.set("trust proxy", 1);

// Apply Global Rate Limiter to all API routes
app.use("/api", globalLimiter);

app.use("/api/auth", authLimiter, authRoutes); // Apply stricter limit to auth
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance", attendanceRoutes); // Use attendance routes
app.use("/api/rectifications", rectificationRoutes); // Use rectification routes
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/personal", personalRoutes); // Register personal dashboard routes
app.use("/api/chat", chatLimiter, chatRoutes); // Register chat routes with spam protection
app.use("/api/workspace-groups", workspaceGroupRoutes);


app.use("/assets/uploads", express.static(path.join(__dirname, "assets/uploads")));

app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});