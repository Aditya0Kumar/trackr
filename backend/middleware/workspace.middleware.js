import WorkspaceMember from "../models/workspaceMember.model.js";
import Workspace from "../models/workspace.model.js";

export const verifyWorkspace = async (req, res, next) => {
    try {
        const workspaceId = req.headers["x-workspace-id"];

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        // Verify membership
        const member = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user.id,
        }).populate("workspace");

        if (!member) {
            return res.status(403).json({ message: "Access denied: Not a member of this workspace" });
        }

        if (!member.workspace) {
           return res.status(404).json({ message: "Workspace not found (Orphaned Member Record)" });
        }

        req.workspace = member.workspace;
        req.workspaceMember = member;

        next();
    } catch (error) {
        console.error("Workspace verification error:", error);
        res.status(500).json({ message: "Internal server error during workspace verification" });
    }
};
