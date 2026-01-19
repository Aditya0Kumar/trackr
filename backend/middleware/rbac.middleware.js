export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.workspaceMember) {
            return res.status(500).json({ message: "Workspace context missing" });
        }

        if (req.workspaceMember.role === "Owner") {
            return next();
        }

        if (!allowedRoles.includes(req.workspaceMember.role)) {
            return res.status(403).json({
                message: `Access denied: Requires one of the following roles: ${allowedRoles.join(", ")}`,
            });
        }

        next();
    };
};
