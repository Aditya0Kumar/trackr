import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inviteCode: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
