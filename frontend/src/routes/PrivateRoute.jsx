import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ requireWorkspace = true }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    // Check if user is authenticated
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Check if workspace context is required and present
    if (requireWorkspace && !currentWorkspace) {
        return <Navigate to="/workspace/select" replace />;
    }

    // Note: Role checks within a workspace should happen inside components or a new `RoleRoute` wrapper
    // Global `allowedRoles` no longer applies since roles are workspace-specific.
    
    return <Outlet />;
};

export default PrivateRoute;
