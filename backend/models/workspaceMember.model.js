import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Manager", "Member"],
            default: "Member",
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index to ensure a user can only be in a workspace once
workspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

// Index for fast lookup of a user's workspaces
workspaceMemberSchema.index({ user: 1 });

// Index for fast lookup of members in a workspace
workspaceMemberSchema.index({ workspace: 1 });

const WorkspaceMember = mongoose.model("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMember;
