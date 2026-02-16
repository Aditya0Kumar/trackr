import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js"; // Import WorkspaceMember
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
    try {
        // Build query for population based on search
        const searchQuery = req.query.search;
        let populateQuery = { path: "user", select: "-password" };

        if (searchQuery) {
            populateQuery.match = {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { email: { $regex: searchQuery, $options: "i" } },
                ],
            };
        }

        // Fetch all members of the current workspace
        const members = await WorkspaceMember.find({ workspace: req.workspace._id }).populate(populateQuery);
        
        // Filter out members where user didn't match (populate returns null)
        const users = members
            .filter(m => m.user)
            .map(m => m.user);

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

export const getConnections = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // 1. Find all workspaces the current user belongs to
        const myMemberships = await WorkspaceMember.find({ user: userId });
        const workspaceIds = myMemberships.map(m => m.workspace);

        // 2. Build population query for search
        const searchQuery = req.query.search;
        let populateQuery = { path: "user", select: "_id name email profileImageUrl" };
        
        if (searchQuery) {
            populateQuery.match = {
                 $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { email: { $regex: searchQuery, $options: "i" } },
                ],
            };
        }

        // 3. Find all members in those workspaces
        const allMembers = await WorkspaceMember.find({ workspace: { $in: workspaceIds } })
            .populate(populateQuery);

        // 4. Extract unique users, excluding self
        const uniqueUsers = new Map();
        allMembers.forEach(m => {
            if (m.user && m.user._id.toString() !== userId) {
                if (!uniqueUsers.has(m.user._id.toString())) {
                    uniqueUsers.set(m.user._id.toString(), m.user);
                }
            }
        });

        res.status(200).json(Array.from(uniqueUsers.values()));
    } catch (error) {
        next(error);
    }
};