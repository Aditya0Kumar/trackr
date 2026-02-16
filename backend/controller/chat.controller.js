import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import WorkspaceGroup from "../models/workspaceGroup.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import { errorHandler } from "../utils/error.js";
import { io } from "../socket/socket.js";

// === PERSONAL CHAT ===

// Get all personal conversations for the current user (where workspaceId is null)
export const getPersonalConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            members: { $in: [userId] },
            workspaceId: null,
        })
            .populate("members", "name profileImageUrl email")
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching personal conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create or get existing personal conversation with another user
export const createPersonalConversation = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        // Check if conversation already exists
        let existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
            workspaceId: null,
        }).populate("members", "name profileImageUrl email");

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        // Shared Workspace Check (Privacy/Security)
        const myWorkspaces = await WorkspaceMember.find({ user: senderId }).distinct("workspace");
        const receiverWorkspaces = await WorkspaceMember.find({ user: receiverId, workspace: { $in: myWorkspaces } });
        
        if (receiverWorkspaces.length === 0) {
            return next(errorHandler(403, "You can only chat with users from shared workspaces"));
        }

        // Create new conversation
        const newConversation = new Conversation({
            members: [senderId, receiverId],
            workspaceId: null,
            unreadCounts: {
                [senderId]: 0,
                [receiverId]: 0,
            },
        });

        await newConversation.save();
        
        // Populate members before returning
        conversation = await Conversation.findById(newConversation._id).populate(
            "members",
            "name profileImageUrl email"
        );

        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating personal conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// === WORKSPACE CHAT ===

// Get the single group conversation for a workspace
export const getWorkspaceGroupConversation = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const workspaceId = req.workspace._id;

        // Fetch Conversation
        let conversation = await Conversation.findOne({
            workspaceId: workspaceId,
            groupId: groupId,
        }).populate("lastMessage.sender", "name email profileImageUrl");

        // Auto-Create if Missing
        if (!conversation) {
            // Check if group actually exists first to avoid orphan convos
            const groupExists = await WorkspaceGroup.findOne({ _id: groupId, workspace: workspaceId });
            if (!groupExists) {
                return next(errorHandler(404, "Group not found in this workspace"));
            }

            conversation = new Conversation({
                workspaceId,
                groupId,
                members: [],
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// === MESSAGES ===

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Security check: If personal, user must be in members. If workspace, user must be in workspace.
        const conversation = await Conversation.findById(conversationId);
        if(!conversation) return res.status(404).json({message: "Conversation not found"});

        const userId = req.user.id;

        if (conversation.workspaceId) {
             // Access control via workspace membership
        } else {
            // Personal Chat: User MUST be in members
            const isMember = conversation.members.some(m => m.toString() === userId);
            if (!isMember) {
                 return res.status(403).json({ message: "Not authorized to view this conversation" });
            }
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 }) // Oldest first
            .populate("sender", "name profileImageUrl");

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text, attachments } = req.body;
        const senderId = req.user.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            text,
            attachments: attachments || [],
            readBy: [senderId],
        });

        await newMessage.save();

        // Update conversation last message
        conversation.lastMessage = {
            text,
            sender: senderId,
            createdAt: new Date(),
        };

        // Update unread counts - ONLY for Personal Chat
        if (!conversation.workspaceId) {
            conversation.members.forEach((memberId) => {
                if (memberId.toString() !== senderId) {
                     const currentCount = conversation.unreadCounts.get(memberId.toString()) || 0;
                     conversation.unreadCounts.set(memberId.toString(), currentCount + 1);
                }
            });
        }

        await conversation.save();

        const populatedMessage = await Message.findById(newMessage._id).populate(
            "sender",
            "name profileImageUrl"
        );

        // Real-time emission
        if (conversation.workspaceId && conversation.groupId) {
            io.to(`group_${conversation.groupId}`).emit("new_message", populatedMessage);
        } else {
            io.to(`chat_${conversationId}`).emit("new_message", populatedMessage);

            // For Personal Chat: Emit notification to receiver for unread badge
            conversation.members.forEach((memberId) => {
                if (memberId.toString() !== senderId) {
                        io.to(memberId.toString()).emit("chat_notification", {
                        conversationId,
                        sender: populatedMessage.sender,
                        text,
                        unreadCount: conversation.unreadCounts.get(memberId.toString())
                        });
                }
            });
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markMessageAsRead = async (req, res) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user.id;

         // Reset unread count for this user
        const conversation = await Conversation.findById(conversationId);
        if (conversation && conversation.unreadCounts) {
             conversation.unreadCounts.set(userId, 0);
             await conversation.save();
        }

        res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
