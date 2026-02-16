
import Task from "../models/task.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";

// =================================================================
// HELPER FUNCTIONS
// =================================================================

// Helper function for dashboard aggregation: Task Distribution
const getTaskDistribution = async (matchFilter = {}) => {
    const taskStatuses = ["Pending", "In Progress", "Completed", "Awaiting Verification"];

    const aggregationPipeline = [
        { $match: matchFilter },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ];

    const taskDistributionRaw = await Task.aggregate(aggregationPipeline);
    
    // Recalculate total tasks based on the match filter
    const totalTasks = await Task.countDocuments(matchFilter);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, "");

        acc[formattedKey] =
            taskDistributionRaw.find((item) => item._id === status)?.count || 0;

        return acc;
    }, {});

    taskDistribution["All"] = totalTasks;
    return taskDistribution;
};

// Helper function for dashboard aggregation: Task Priority Level
const getTaskPriorityLevel = async (matchFilter = {}) => {
    const taskPriorities = ["Low", "Medium", "High"];

    const aggregationPipeline = [
        { $match: matchFilter },
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
    ];

    const taskPriorityLevelRaw = await Task.aggregate(aggregationPipeline);

    return taskPriorities.reduce((acc, priority) => {
        acc[priority] =
            taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
        return acc;
    }, {});
};

// =================================================================
// CONTROLLER FUNCTIONS
// =================================================================

// GET /api/personal/tasks
// Fetch all tasks for the logged-in user across ALL workspaces
export const getMyTasks = async (req, res, next) => {
    try{
        const userId = req.user.id;
        
        // Filter: Assigned to user, not archived
        // Note: We populate 'workspace' to show where the task is from
        const tasks = await Task.find({ 
            assignedTo: userId,
            $or: [{ isArchived: false }, { isArchived: { $exists: false } }]
        })
        .populate("workspace", "name")
        .populate("project", "name")
        .sort({ dueDate: 1 });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const grouped = {
            overdue: [],
            dueToday: [],
            upcoming: [],
            noDueDate: []
        };

        tasks.forEach(task => {
            if(!task.dueDate){
                grouped.noDueDate.push(task);
                return;
            }

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            if(dueDate < today && task.status !== "Completed") {
                grouped.overdue.push(task);
            }else if(dueDate.getTime() === today.getTime() && task.status !== "Completed") {
                grouped.dueToday.push(task);
            }else{
                grouped.upcoming.push(task);
            }
        });

        res.status(200).json({
            allTasks: tasks,
            grouped
        });

    }catch(error){
        next(error);
    }
};

// GET /api/personal/attendance
export const getMyAttendance = async (req, res, next) => {
    try{
        const userId = req.user.id;

        // Fetch user's attendance records sorted by date desc
        const attendance = await Attendance.find({ user: userId })
            .populate("workspace", "name")
            .sort({ date: -1 });

        res.status(200).json(attendance);
    }catch(error){
        next(error);
    }
};

// GET /api/personal/dashboard
// Productivity stats

import { getOrSetCache } from "../utils/cache.helper.js";

// ... existing code

// GET /api/personal/dashboard
// Productivity stats
export const getMyDashboardStats = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const key = `v1:personal:${userId}:dashboard`;

        // Cache TTL: 60 seconds
        const stats = await getOrSetCache(key, 60, async () => {
             const userObjectId = new mongoose.Types.ObjectId(userId);
            
            // Filter for active tasks across ALL workspaces
            const activeFilter = { $or: [{ isArchived: false }, { isArchived: { $exists: false } }] };
            const matchFilter = { assignedTo: userObjectId, ...activeFilter }; 

            const totalTasks = await Task.countDocuments(matchFilter);
            const pendingTasks = await Task.countDocuments({
                ...matchFilter,
                status: "Pending",
            });
            const completedTasks = await Task.countDocuments({
                ...matchFilter,
                status: "Completed",
            });
            const overdueTasks = await Task.countDocuments({
                ...matchFilter,
                status: { $ne: "Completed" },
                dueDate: { $lt: new Date() },
            });

            const taskDistribution = await getTaskDistribution(matchFilter);
            const taskPriorityLevel = await getTaskPriorityLevel(matchFilter);

            const recentTasks = await Task.find({
                ...matchFilter,
                status: { $ne: "Completed" },
                dueDate: { $exists: true, $ne: null }
            })
                .sort({ dueDate: 1 })
                .limit(10)
                .select("title status priority dueDate createdAt workspace")
                .populate("workspace", "name"); // Populate workspace info since it's global
            
            return {
                statistics: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overdueTasks,
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevel,
                },
                recentTasks,
            };
        });

        res.status(200).json(stats);
    } catch(error){
        next(error);
    }
};
