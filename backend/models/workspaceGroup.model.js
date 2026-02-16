import mongoose from "mongoose";

const workspaceGroupSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Ensure unique group names per workspace
workspaceGroupSchema.index({ workspace: 1, name: 1 }, { unique: true });

const WorkspaceGroup = mongoose.model("WorkspaceGroup", workspaceGroupSchema);
export default WorkspaceGroup;
