import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Used ONLY for Personal Chat (workspaceId: null). Ignored for Workspace Chat.
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null, // Null for personal chats, populated for workspace chats
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkspaceGroup",
            default: null, // Null for personal chats, populated for workspace chats
        },
        // name: removed, use Group name instead
        lastMessage: {
            text: String,
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: Date,
        },
        unreadCounts: {
            type: Map,
            of: Number, // UserId -> count
            default: {},
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
