import WorkspaceGroup from "../models/workspaceGroup.model.js";
import Conversation from "../models/conversation.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new group (Admin/Manager only)
export const createGroup = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(errorHandler(400, "Group name is required"));
        }

        // Check if group name already exists in this workspace
        const existingGroup = await WorkspaceGroup.findOne({
            workspace: req.workspace._id,
            name: { $regex: new RegExp("^" + name + "$", "i") }, // Case insensitive check
        });

        if (existingGroup) {
            return next(errorHandler(400, "Group with this name already exists"));
        }

        // Create Group
        const group = new WorkspaceGroup({
            workspace: req.workspace._id,
            name,
            createdBy: req.user.id,
        });
        await group.save();

        // Auto-create Conversation for the group
        const conversation = new Conversation({
            workspaceId: req.workspace._id,
            groupId: group._id,
            members: [], // Ignored for workspace chats
        });
        await conversation.save();

        res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

// Get all groups for the current workspace
export const getGroups = async (req, res, next) => {
    try {
        let groups = await WorkspaceGroup.find({ workspace: req.workspace._id })
            .sort({ isDefault: -1, createdAt: 1 }); // Default first, then by creation time

        // Lazy creation of "General" group for existing workspaces
        if (groups.length === 0) {
            const generalGroup = new WorkspaceGroup({
                workspace: req.workspace._id,
                name: "General",
                isDefault: true,
                createdBy: req.user.id,
            });
            await generalGroup.save();
            
            // Auto-create Conversation for General group (if not exists)
             const generalConversation = new Conversation({
                workspaceId: req.workspace._id,
                groupId: generalGroup._id,
                members: [],
            });
             await generalConversation.save();

            groups = [generalGroup];
        }

        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};
