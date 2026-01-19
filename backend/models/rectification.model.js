import mongoose from "mongoose";

const rectificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        month: {
            type: Number, // 0-11
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
    },
    { timestamps: true }
);

// Ensure only one record per user per month/year per workspace
rectificationSchema.index({ user: 1, month: 1, year: 1, workspace: 1 }, { unique: true });

const Rectification = mongoose.model("Rectification", rectificationSchema);

export default Rectification;