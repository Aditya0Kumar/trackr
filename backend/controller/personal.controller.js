
import Task from "../models/task.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";

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
export const getMyDashboardStats = async (req, res, next) => {
    try{
        const userId = req.user.id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const overdueTasks = await Task.countDocuments({ 
            assignedTo: userId, 
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Calculate Focus Score (Basic example: Completion Rate)
        const focusScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.status(200).json({
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks,
                focusScore
            }
        });
    } catch(error){
        next(error);
    }
};
