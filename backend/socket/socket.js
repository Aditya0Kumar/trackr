import { Server } from "socket.io";
// import http from "http"; // Removed
// import express from "express"; // Removed
import dotenv from "dotenv";

dotenv.config();

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONT_END_URL || "http://localhost:5173"],
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        const userId = socket.handshake.query.userId;
        
        if (userId && userId !== "undefined") {
            socket.join(userId);
        }

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
        
        socket.on("join_task", (taskId) => {
            socket.join(taskId);
            console.log(`User ${userId} joined task ${taskId}`);
        });
        
        socket.on("leave_task", (taskId) => {
            socket.leave(taskId);
        });

        // Chat Events
        socket.on("join_chat", (conversationId) => {
            socket.join(`chat_${conversationId}`);
            console.log(`User ${userId} joined chat_${conversationId}`);
        });

        socket.on("leave_chat", (conversationId) => {
            socket.leave(`chat_${conversationId}`);
        });

        socket.on("join_group", (groupId) => {
            socket.join(`group_${groupId}`);
            console.log(`User ${userId} joined group_${groupId}`);
        });

        socket.on("leave_group", (groupId) => {
            socket.leave(`group_${groupId}`);
        });

        socket.on("typing", ({ conversationId, isTyping }) => {
            socket.to(`chat_${conversationId}`).emit("typing", {
                userId,
                isTyping,
                conversationId
            });
        });
    });

    return io;
};

export { io, initSocket };
