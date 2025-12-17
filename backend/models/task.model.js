import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },
    
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    
    verified: {
        type: Boolean,
        default: false,
    },
});

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
            // Examples: "created_task", "updated_title", "changed_priority", "assigned_user", "removed_user", "added_attachment", "removed_attachment", "completed_todo", "uncompleted_todo", "verified_todo", "unverified_todo", "changed_status", "added_comment"
        },
        details: {
            type: String, // e.g., "from 'Low' to 'High'", "added 'Fix bug'", "status changed to 'In Progress'"
        },
    },
    { timestamps: true }
);

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Awaiting Verification"],
            default: "Pending",
        },

        dueDate: {
            type: Date,
            required: true,
        },

        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        createdBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        attachments: [
            {
                type: String,
            },
        ],

        todoChecklist: [todoSchema],

        progress: { type: Number, default: 0 },

        comments: [commentSchema],

        statusHistory: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["Pending", "In Progress", "Completed", "Awaiting Verification"],
                    required: true,
                },
            },
        ], // Keep for now, but will be replaced by activityLog for display

        activityLog: [activityLogSchema], // New comprehensive activity log
        
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;