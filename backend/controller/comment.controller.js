import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";
import { createNotifications } from "../utils/notification.js";
import { io } from "../socket/socket.js";

export const addCommentToTask = async (req, res, next) => {
    try {
        const { text } = req.body;
        const taskId = req.params.id;
        const userId = req.user.id;

        if (!text || text.trim() === "") {
            return next(errorHandler(400, "Comment text is required"));
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        const newComment = {
            user: userId,
            text: text,
        };

        task.comments.push(newComment);
        await task.save();

        // --- Notification Logic ---
        const assignedUserIds = task.assignedTo.map((id) => id.toString());
        const senderName = req.user.name || "A user";
        
        await createNotifications(
            assignedUserIds,
            userId,
            "new_comment",
            `${senderName} commented on task: ${task.title}`,
            `/user/task-details/${taskId}`
        );
        // --- End Notification Logic ---

        // Populate the newly added comment's user details before sending response
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("comments.user", "name profileImageUrl");

        // Emit real-time event
        io.to(taskId).emit("task_comment_added", updatedTask);

        res.status(201).json({
            message: "Comment added successfully",
            task: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};