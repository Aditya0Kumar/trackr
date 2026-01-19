import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js"; // Import WorkspaceMember
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
    try {
        // Fetch all members of the current workspace
        const members = await WorkspaceMember.find({ workspace: req.workspace._id }).populate("user", "-password");
        const users = members.map(m => m.user); // Extract User documents

        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const userId = user._id;

                const pendingTasks = await Task.countDocuments({
                    assignedTo: userId,
                    status: "Pending",
                    workspace: req.workspace._id,
                });

                const inProgressTasks = await Task.countDocuments({
                    assignedTo: userId,
                    status: "In Progress",
                    workspace: req.workspace._id,
                });

                const completedTasks = await Task.countDocuments({
                    assignedTo: userId,
                    status: "Completed",
                    workspace: req.workspace._id,
                });

                const totalTasks = await Task.countDocuments({
                    assignedTo: userId,
                    workspace: req.workspace._id,
                });

                const overdueTasks = await Task.countDocuments({
                    assignedTo: userId,
                    status: { $ne: "Completed" },
                    dueDate: { $lt: new Date() },
                    workspace: req.workspace._id,
                });

                const completionRate =
                    totalTasks > 0
                        ? Math.round((completedTasks / totalTasks) * 100)
                        : 0;

                return {
                    ...user._doc,
                    totalTasks,
                    overdueTasks,
                    completionRate,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        );

        res.status(200).json(userWithTaskCounts);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return next(errorHandler(404, "User not found!"));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};