import mongoose from "mongoose";
import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";
import { createNotifications } from "../utils/notification.js";

// =================================================================
// HELPER FUNCTIONS
// =================================================================

// Helper function to calculate task metrics (completed count)
const calculateTaskMetrics = (tasks) => {
    return Promise.all(
        tasks.map(async (task) => {
            // Convert the Mongoose document to a plain object first
            const taskObject = task.toObject();
            
            // Calculate completed count using the plain object's checklist
            const completedCount = (taskObject.todoChecklist || []).filter(
                (item) => item.completed
            ).length;

            // The frontend expects this count as 'completedTodoCount'
            return { ...taskObject, completedTodoCount: completedCount };
        })
    );
};

// Helper function to calculate status summary for task lists
const calculateStatusSummary = async (baseFilter) => {
    const allTasks = await Task.countDocuments(baseFilter);
    const pendingTasks = await Task.countDocuments({
        ...baseFilter,
        status: "Pending",
    });
    const inProgressTasks = await Task.countDocuments({
        ...baseFilter,
        status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({
        ...baseFilter,
        status: "Completed",
    });
    const awaitingVerificationTasks = await Task.countDocuments({
        ...baseFilter,
        status: "Awaiting Verification",
    });


    return {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        awaitingVerificationTasks,
    };
};

// Helper function for dashboard aggregation: Task Distribution
const getTaskDistribution = async (matchFilter = {}) => {
    const taskStatuses = ["Pending", "In Progress", "Completed", "Awaiting Verification"];

    const aggregationPipeline = [
        { $match: matchFilter }, // Use the full matchFilter here
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
        { $match: matchFilter }, // Use the full matchFilter here
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

export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist, // Array of strings (texts)
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return next(
                errorHandler(400, "assignedTo must be an array of user IDs")
            );
        }

        // Initialize checklist items with completed=false, verified=false
        const initialChecklist = (todoChecklist || []).map(text => ({
            text: text,
            completed: false,
            completedBy: null,
            verified: false,
        }));

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist: initialChecklist,
            createdBy: req.user.id,
            statusHistory: [{ user: req.user.id, status: "Pending" }], // Initialize history
            activityLog: [{ user: req.user.id, action: "created_task", details: `Task '${title}' created.` }],
            isArchived: false, // Default to not archived
        });

        // --- Notification Logic: Notify assigned users ---
        const assignedUserIds = assignedTo.map((id) => id.toString());
        const senderName = req.user.name || "An admin";

        await createNotifications(
            assignedUserIds,
            req.user.id,
            "task_assigned",
            `${senderName} assigned you to a new task: ${title}`,
            `/user/task-details/${task._id}`
        );
        // --- End Notification Logic ---

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const { status, priority, sort, userId, search, archived } = req.query;

        const isArchived = archived === 'true';

        let baseArchiveFilter = {};
        if (isArchived) {
            // Only show tasks explicitly marked as archived
            baseArchiveFilter.isArchived = true;
        } else {
            // Show tasks explicitly marked as NOT archived OR tasks where the field doesn't exist (legacy tasks)
            baseArchiveFilter.$or = [{ isArchived: false }, { isArchived: { $exists: false } }];
        }

        let filter = { ...baseArchiveFilter };
        let sortOptions = { createdAt: -1 }; // Default sort: newest first

        // 1. Base Scope Filter (Determines who the tasks belong to)
        const summaryBaseFilter = { ...baseArchiveFilter }; // Start with the archive filter

        if (req.user.role === "user") {
            // Regular users only see tasks assigned to them
            filter.assignedTo = req.user.id;
            summaryBaseFilter.assignedTo = req.user.id;
        } else if (req.user.role === "admin" && userId) {
            // Admin can filter by a specific user ID
            filter.assignedTo = userId;
            summaryBaseFilter.assignedTo = userId;
        }
        // If admin and no userId, filter remains empty (sees all tasks)

        // 2. Status Filter
        if (status) {
            filter.status = status;
        }

        // 3. Priority Filter
        if (priority && priority !== "All") {
            filter.priority = priority;
        }
        
        // 4. Search Filter (Applies to title and description)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            
            const searchCriteria = {
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                ]
            };
            
            // Merge search criteria with existing filters
            filter = { ...filter, ...searchCriteria };
        }


        // 5. Sorting Logic
        if (sort) {
            switch (sort) {
                case "dueDateAsc":
                    sortOptions = { dueDate: 1 };
                    break;
                case "dueDateDesc":
                    sortOptions = { dueDate: -1 };
                    break;
                case "createdAtAsc":
                    sortOptions = { createdAt: 1 };
                    break;
                case "createdAtDesc":
                    sortOptions = { createdAt: -1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
        }

        // 6. Fetch Tasks
        const tasks = await Task.find(filter)
            .sort(sortOptions)
            .populate("assignedTo", "name email profileImageUrl");

        const tasksWithMetrics = await calculateTaskMetrics(tasks);

        // 7. Status Summary (calculated based on summaryBaseFilter)
        const statusSummary = await calculateStatusSummary(summaryBaseFilter);

        res.status(200).json({
            tasks: tasksWithMetrics,
            statusSummary,
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("comments.user", "name profileImageUrl")
            .populate("statusHistory.user", "name profileImageUrl") // Keep for now, will be replaced by activityLog for display
            .populate("todoChecklist.completedBy", "name profileImageUrl")
            .populate("activityLog.user", "name profileImageUrl"); // Populate user for activity log

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        const oldAssignedTo = task.assignedTo.map(id => id.toString());
        const oldTitle = task.title;
        const oldDescription = task.description;
        const oldPriority = task.priority;
        const oldDueDate = task.dueDate ? task.dueDate.toISOString() : null;
        const oldAttachments = [...task.attachments];
        const oldStatus = task.status;
        const isAdmin = req.user.role === "admin";

        // Track changes for activity log
        const activityEntries = [];

        if (req.body.title && req.body.title !== oldTitle) {
            task.title = req.body.title;
            activityEntries.push({ user: req.user.id, action: "updated_title", details: `Title changed from '${oldTitle}' to '${task.title}'.` });
        }
        if (req.body.description && req.body.description !== oldDescription) {
            task.description = req.body.description;
            activityEntries.push({ user: req.user.id, action: "updated_description", details: `Description updated.` });
        }
        if (req.body.priority && req.body.priority !== oldPriority) {
            task.priority = req.body.priority;
            activityEntries.push({ user: req.user.id, action: "changed_priority", details: `Priority changed from '${oldPriority}' to '${task.priority}'.` });
        }
        if (req.body.dueDate) {
            const newDueDate = new Date(req.body.dueDate).toISOString();
            if (newDueDate !== oldDueDate) {
                task.dueDate = req.body.dueDate;
                activityEntries.push({ user: req.user.id, action: "changed_due_date", details: `Due date changed to '${moment(task.dueDate).format('MMM Do, YYYY')}'.` });
            }
        }
        
        // Handle attachments changes
        if (req.body.attachments) {
            const newAttachments = req.body.attachments;
            const addedAttachments = newAttachments.filter(att => !oldAttachments.includes(att));
            const removedAttachments = oldAttachments.filter(att => !newAttachments.includes(att));

            if (addedAttachments.length > 0) {
                activityEntries.push({ user: req.user.id, action: "added_attachments", details: `Added ${addedAttachments.length} attachment(s).` });
            }
            if (removedAttachments.length > 0) {
                activityEntries.push({ user: req.user.id, action: "removed_attachments", details: `Removed ${removedAttachments.length} attachment(s).` });
            }
            task.attachments = newAttachments;
        }


        // Handle checklist update from CreateTask/UpdateTask form
        if (req.body.todoChecklist) {
            const incomingTexts = req.body.todoChecklist; // Array of strings (texts)
            const existingChecklistMap = new Map(task.todoChecklist.map(item => [item.text, item]));
            
            const newChecklist = incomingTexts.map(text => {
                const existingItem = existingChecklistMap.get(text);
                
                if (existingItem) {
                    return existingItem; // Keep existing item properties
                } else {
                    // New item added via form
                    activityEntries.push({ user: req.user.id, action: "added_todo_item", details: `Added checklist item: '${text}'.` });
                    return {
                        text: text,
                        completed: false,
                        completedBy: null,
                        verified: false,
                    };
                }
            });

            // Check for removed items
            task.todoChecklist.forEach(existingItem => {
                if (!incomingTexts.includes(existingItem.text)) {
                    activityEntries.push({ user: req.user.id, action: "removed_todo_item", details: `Removed checklist item: '${existingItem.text}'.` });
                }
            });
            
            task.todoChecklist = newChecklist;
            
            // Recalculate progress and status based on the new checklist structure
            const totalItems = task.todoChecklist.length;
            const completedCount = task.todoChecklist.filter(item => item.completed).length;
            const verifiedCount = task.todoChecklist.filter(item => item.verified).length;

            task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

            if (task.progress === 100) {
                task.status = verifiedCount === totalItems ? "Completed" : "Awaiting Verification";
            } else if (task.progress > 0) {
                task.status = "In Progress";
            } else {
                task.status = "Pending";
            }
        }


        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return next(
                    errorHandler(400, "assignedTo must be an array of user IDs")
                );
            }

            const newAssignedTo = req.body.assignedTo.map(id => id.toString());
            const oldAssignedToIds = oldAssignedTo.map(id => id.toString());
            const addedUsers = newAssignedTo.filter(id => !oldAssignedToIds.includes(id));
            const removedUsers = oldAssignedToIds.filter(id => !newAssignedTo.includes(id));

            if (addedUsers.length > 0) {
                activityEntries.push({ user: req.user.id, action: "assigned_user", details: `Assigned ${addedUsers.length} new user(s).` });
            }
            if (removedUsers.length > 0) {
                activityEntries.push({ user: req.user.id, action: "unassigned_user", details: `Unassigned ${removedUsers.length} user(s).` });
            }
            task.assignedTo = req.body.assignedTo;
        }
        
        // Check if status was explicitly updated in the body (e.g., from CreateTask page update)
        if (req.body.status && req.body.status !== oldStatus) {
            
            // Enforce verification flow: Only admin can set to Completed
            if (req.body.status === "Completed" && !isAdmin) {
                return next(errorHandler(403, "Only administrators can mark a task as Completed."));
            }
            
            // Prevent Admin from setting Awaiting Verification
            if (req.body.status === "Awaiting Verification" && isAdmin) {
                return next(errorHandler(403, "Admins cannot set status to Awaiting Verification."));
            }

            task.status = req.body.status;
            
            // Record status change in history
            task.statusHistory.push({
                user: req.user.id,
                status: task.status,
            });
            activityEntries.push({ user: req.user.id, action: "changed_status", details: `Status changed from '${oldStatus}' to '${task.status}'.` });
            
            // If admin manually sets to Completed, ensure checklist is fully verified
            if (task.status === "Completed") {
                task.todoChecklist.forEach((item) => {
                    if (!item.completed) {
                        item.completed = true;
                        item.completedBy = req.user.id;
                        activityEntries.push({ user: req.user.id, action: "completed_todo", details: `Completed checklist item: '${item.text}' (Admin Override).` });
                    }
                    if (!item.verified) {
                        item.verified = true;
                        activityEntries.push({ user: req.user.id, action: "verified_todo", details: `Verified checklist item: '${item.text}' (Admin Override).` });
                    }
                });
            }
        }

        task.activityLog.push(...activityEntries); // Add all collected activity entries

        const updatedTask = await task.save();

        // --- Notification Logic: Notify users if assignment changed or title changed ---
        const newAssignedTo = task.assignedTo.map(id => id.toString());
        const newlyAssigned = newAssignedTo.filter(id => !oldAssignedTo.includes(id));
        const senderName = req.user.name || "An admin";

        if (newlyAssigned.length > 0) {
            await createNotifications(
                newlyAssigned,
                req.user.id,
                "task_assigned",
                `${senderName} assigned you to task: ${task.title}`,
                `/user/task-details/${task._id}`
            );
        }

        if (oldTitle !== task.title) {
             await createNotifications(
                newAssignedTo,
                req.user.id,
                "status_change", // Using status_change type for general updates for now
                `${senderName} updated the title of task: ${task.title}`,
                `/user/task-details/${task._id}`
            );
        }
        // --- End Notification Logic ---


        return res
            .status(200)
            .json({ updatedTask, message: "Task updated successfully!" });
    } catch (error) {
        next(error);
    }
};

export const archiveTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        // Perform soft delete (archiving)
        task.isArchived = true;
        task.activityLog.push({ user: req.user.id, action: "archived_task", details: `Task archived by ${req.user.name}.` });
        await task.save();

        res.status(200).json({ message: "Task archived successfully!" });
    } catch (error) {
        next(error);
    }
};

export const unarchiveTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        // Perform unarchiving
        task.isArchived = false;
        task.activityLog.push({ user: req.user.id, action: "unarchived_task", details: `Task restored from archive by ${req.user.name}.` });
        await task.save();

        res.status(200).json({ message: "Task restored successfully!" });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    // This function is now an alias for archiveTask to maintain the DELETE route usage in CreateTask.jsx
    return archiveTask(req, res, next);
};


export const updateTaskStatus = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user.id.toString()
        );
        const isAdmin = req.user.role === "admin";

        if (!isAssigned && !isAdmin) {
            return next(errorHandler(403, "Unauthorized"));
        }

        const oldStatus = task.status;
        const newStatus = req.body.status || task.status;

        // 1. Enforce Verification Flow
        if (newStatus === "Completed") {
            if (!isAdmin) {
                return next(errorHandler(403, "Only administrators can mark a task as Completed."));
            }
            
            // Admin override: If admin sets to Completed, force all checklist items to be completed and verified.
            task.todoChecklist.forEach((item) => {
                if (!item.completed) {
                    item.completed = true;
                    item.completedBy = req.user.id; // Assign completion to the admin if not already done
                    task.activityLog.push({ user: req.user.id, action: "completed_todo", details: `Completed checklist item: '${item.text}' (Admin Override).` });
                }
                if (!item.verified) {
                    item.verified = true;
                    task.activityLog.push({ user: req.user.id, action: "verified_todo", details: `Verified checklist item: '${item.text}' (Admin Override).` });
                }
            });
            
            // Recalculate progress
            const totalItems = task.todoChecklist.length;
            task.progress = totalItems > 0 ? 100 : 0;

        } else if (newStatus === "Awaiting Verification" && isAdmin) {
            // 2. Prevent Admin from manually setting Awaiting Verification
            return next(errorHandler(403, "Admins cannot manually set status to Awaiting Verification. This status is set automatically when all checklist items are completed by a user."));
        }


        if (oldStatus === newStatus) {
            return res.status(200).json({ message: "Status unchanged", task });
        }

        task.status = newStatus;

        // Record status change in history and activity log
        task.statusHistory.push({
            user: req.user.id,
            status: task.status,
        });
        task.activityLog.push({ user: req.user.id, action: "changed_status", details: `Status changed from '${oldStatus}' to '${task.status}'.` });


        await task.save();

        // --- Notification Logic: Notify assigned users if status changed ---
        if (oldStatus !== task.status) {
            const assignedUserIds = task.assignedTo.map((id) => id.toString());
            const senderName = req.user.name || "A user";

            await createNotifications(
                assignedUserIds,
                req.user.id,
                "status_change",
                `${senderName} changed status of task '${task.title}' to ${task.status}`,
                `/user/task-details/${task._id}`
            );
        }
        // --- End Notification Logic ---

        // Re-fetch and populate the task to include the new history entry's user details
        const updatedTask = await Task.findById(req.params.id)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("comments.user", "name profileImageUrl")
            .populate("statusHistory.user", "name profileImageUrl")
            .populate("todoChecklist.completedBy", "name profileImageUrl")
            .populate("activityLog.user", "name profileImageUrl");

        res.status(200).json({ message: "Task status updated", task: updatedTask });
    } catch (error) {
        next(error);
    }
};

export const updateTaskChecklist = async (req, res, next) => {
    try {
        const { todoChecklist: incomingChecklist } = req.body; // Incoming: [{ text, completed }]
        const taskId = req.params.id;
        const userId = req.user.id;
        const isAdmin = req.user.role === "admin";

        const task = await Task.findById(taskId);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        const isAssigned = task.assignedTo.some(id => id.toString() === userId.toString());

        if (!isAssigned && !isAdmin) {
            return next(
                errorHandler(403, "Not authorized to update checklist")
            );
        }

        const oldStatus = task.status;
        const updatedChecklist = [];
        let completedCount = 0;
        let verifiedCount = 0;
        const activityEntries = [];

        // Merge incoming checklist with existing data to preserve _id, completedBy, and verified status
        for (const incomingItem of incomingChecklist) {
            const existingItem = task.todoChecklist.find(item => item.text === incomingItem.text);
            
            if (existingItem) {
                const newItem = {
                    ...existingItem.toObject(),
                    completed: incomingItem.completed,
                };

                if (incomingItem.completed && !existingItem.completed) {
                    // Item was just completed
                    newItem.completedBy = userId;
                    newItem.verified = false; // Reset verification on re-completion
                    activityEntries.push({ user: userId, action: "completed_todo", details: `Completed checklist item: '${newItem.text}'.` });
                } else if (!incomingItem.completed && existingItem.completed) {
                    // Item was just uncompleted
                    newItem.completedBy = null;
                    newItem.verified = false; // Reset verification on uncompletion
                    activityEntries.push({ user: userId, action: "uncompleted_todo", details: `Uncompleted checklist item: '${newItem.text}'.` });
                }
                
                if (newItem.completed) completedCount++;
                if (newItem.verified) verifiedCount++;

                updatedChecklist.push(newItem);
            } else {
                // This case should ideally not happen if checklist is only modified via form, not directly here
                // But for robustness, handle new items if they appear
                const newItem = {
                    text: incomingItem.text,
                    completed: incomingItem.completed,
                    completedBy: incomingItem.completed ? userId : null,
                    verified: false,
                };
                if (incomingItem.completed) completedCount++;
                activityEntries.push({ user: userId, action: "added_todo_item", details: `Added checklist item: '${newItem.text}'.` });
                updatedChecklist.push(newItem);
            }
        }
        
        task.todoChecklist = updatedChecklist;
        
        const totalItems = task.todoChecklist.length;

        task.progress =
            totalItems > 0
                ? Math.round((completedCount / totalItems) * 100)
                : 0;

        // Determine new status based on progress and verification
        if (task.progress === 100) {
            if (verifiedCount === totalItems) {
                task.status = "Completed";
            } else {
                task.status = "Awaiting Verification";
            }
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        // Record status change if status was updated via checklist
        if (oldStatus !== task.status) {
            task.statusHistory.push({
                user: userId,
                status: task.status,
            });
            activityEntries.push({ user: userId, action: "changed_status", details: `Status changed from '${oldStatus}' to '${task.status}' via checklist update.` });
        }
        task.activityLog.push(...activityEntries);

        await task.save();
        
        // --- Notification Logic: Notify assigned users if status changed via checklist ---
        if (oldStatus !== task.status) {
            const assignedUserIds = task.assignedTo.map((id) => id.toString());
            const senderName = req.user.name || "A user";

            await createNotifications(
                assignedUserIds,
                req.user.id,
                "status_change",
                `${senderName} changed status of task '${task.title}' to ${task.status} via checklist update.`,
                `/user/task-details/${taskId}`
            );
        }
        // --- End Notification Logic ---

        // Re-fetch and populate the task
        const populatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("comments.user", "name profileImageUrl")
            .populate("statusHistory.user", "name profileImageUrl")
            .populate("todoChecklist.completedBy", "name profileImageUrl")
            .populate("activityLog.user", "name profileImageUrl");

        res.status(200).json({
            message: "Task checklist updated",
            task: populatedTask,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyTaskChecklistItem = async (req, res, next) => {
    try {
        const { todoId, verified } = req.body;
        const taskId = req.params.id;
        const userId = req.user.id;

        if (req.user.role !== "admin") {
            return next(errorHandler(403, "Only administrators can verify checklist items."));
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return next(errorHandler(404, "Task not found!"));
        }

        const todoItem = task.todoChecklist.id(todoId);

        if (!todoItem) {
            return next(errorHandler(404, "Checklist item not found."));
        }
        
        if (!todoItem.completed && verified) {
             return next(errorHandler(400, "Cannot verify an incomplete checklist item."));
        }

        const oldStatus = task.status;
        
        todoItem.verified = verified;
        task.activityLog.push({ user: userId, action: verified ? "verified_todo" : "unverified_todo", details: `${verified ? 'Verified' : 'Unverified'} checklist item: '${todoItem.text}'.` });


        // Recalculate status based on verification
        const totalItems = task.todoChecklist.length;
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        const verifiedCount = task.todoChecklist.filter(item => item.verified).length;

        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        if (completedCount === totalItems) {
            if (verifiedCount === totalItems) {
                task.status = "Completed";
            } else {
                task.status = "Awaiting Verification";
            }
        } else if (completedCount > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }
        
        // If status changed, record history
        if (oldStatus !== task.status) {
            task.statusHistory.push({
                user: userId,
                status: task.status,
            });
            task.activityLog.push({ user: userId, action: "changed_status", details: `Status changed from '${oldStatus}' to '${task.status}' via checklist verification.` });
        }

        await task.save();

        // --- Notification Logic ---
        const assignedUserIds = task.assignedTo.map((id) => id.toString());
        const senderName = req.user.name || "An admin";
        
        if (oldStatus !== task.status) {
            await createNotifications(
                assignedUserIds,
                userId,
                "status_change",
                `${senderName} verified task checklist item '${todoItem.text}' and changed task status to ${task.status}.`,
                `/user/task-details/${taskId}`
            );
        }
        // --- End Notification Logic ---

        // Re-fetch and populate the task
        const populatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email profileImageUrl")
            .populate("comments.user", "name profileImageUrl")
            .populate("statusHistory.user", "name profileImageUrl")
            .populate("todoChecklist.completedBy", "name profileImageUrl")
            .populate("activityLog.user", "name profileImageUrl");

        res.status(200).json({
            message: `Checklist item ${verified ? 'verified' : 'unverified'} successfully`,
            task: populatedTask,
        });

    } catch (error) {
        next(error);
    }
};

export const getDashboardData = async (req, res, next) => {
    try {
        // Filter for active tasks, including legacy tasks where isArchived is undefined
        const activeFilter = { $or: [{ isArchived: false }, { isArchived: { $exists: false } }] };
        const baseFilter = activeFilter;
        
        const totalTasks = await Task.countDocuments(baseFilter);
        const pendingTasks = await Task.countDocuments({ ...baseFilter, status: "Pending" });
        const completedTasks = await Task.countDocuments({
            ...baseFilter,
            status: "Completed",
        });
        const overdueTasks = await Task.countDocuments({
            ...baseFilter,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        const taskDistribution = await getTaskDistribution(baseFilter);
        const taskPriorityLevel = await getTaskPriorityLevel(baseFilter);

        const recentTasks = await Task.find(baseFilter)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
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
        });
    } catch (error) {
        next(error);
    }
};

export const userDashboardData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Filter for active tasks, including legacy tasks where isArchived is undefined
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

        const recentTasks = await Task.find(matchFilter)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
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
        });
    } catch (error) {
        next(error);
    }
};