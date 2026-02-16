import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true // Indexed for fast queries
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        required: true,
        // enum: ['created_task', 'updated_task', 'completed_task', 'deleted_task', 'invited_member', 'removed_member', 'joined_workspace'] 
        // Keeping it open string for flexibility initially
    },
    entityType: {
        type: String, // 'Task', 'Project', 'WorkspaceMember', etc.
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // Capture extra details like 'oldStatus', 'newStatus', etc.
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Indexed for sorting
    }
}, { timestamps: true });

// Compound index for fetching logs for a workspace sorted by time
activityLogSchema.index({ workspaceId: 1, timestamp: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
