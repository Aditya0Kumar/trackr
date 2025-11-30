import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
    const { currentUser } = useSelector((state) => state.user);

    // Check if user is authenticated
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (!allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
