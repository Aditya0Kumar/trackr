import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import { motion } from "framer-motion";
import UserAvatar from "./UserAvatar";
import moment from "moment";

const SidebarContent = ({ activeMenu, isCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const { currentWorkspace } = useSelector((state) => state.workspace); // Get current workspace
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        // If in Personal Mode (My Work)
        if (!currentWorkspace) {
            // Filter menu items for Personal Mode
            // Showing: Dashboard, My Tasks, My Attendance
            // Hiding: Projects, Teams, etc. (assuming those are in SIDE_MENU_DATA/USER_SIDE_MENU_DATA)
            // Ideally, we should have a PERSONAL_MENU_DATA constant or filter existing ones.
            // For now, let's filter the existing USER_SIDE_MENU_DATA
            const personalItems = USER_SIDE_MENU_DATA.filter(item => 
                ["Dashboard", "My Tasks", "Calendar", "My Attendance", "Profile", "Workspaces", "Logout"].includes(item.label)
            );
            setMenuData(personalItems);
        } else {
            // Workspace Mode
            // Correct logic using Workspace Role
            // Check for "Admin" or "Manager" (ensure casing matches backend)
            if (["Admin", "Manager", "Owner"].includes(currentWorkspace.role)) {
                 setMenuData(SIDE_MENU_DATA);
            } else {
                 setMenuData(USER_SIDE_MENU_DATA);
            }
        }
    }, [currentUser, currentWorkspace]);

    const handleClick = (route) => {
        if (route === "logout") return handleLogout();
        navigate(route);
        // NOTE: We do NOT toggle isCollapsed here. The collapse state is controlled only by the dedicated button in Sidebar.jsx.
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/sign-out");
            dispatch(signOutSuccess());
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-full text-[var(--text-primary)]">
            {/* profile */}
            <div className={`flex ${isCollapsed ? 'justify-center' : 'flex-col items-center'} mb-4 shrink-0 transition-all duration-300`}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md transform transition-transform duration-300">
                    <UserAvatar 
                        imageUrl={currentUser?.profileImageUrl} 
                        size="w-full h-full" 
                    />
                </div>
                {!isCollapsed && (
                    <div className="mt-2 text-center overflow-hidden w-full px-2">
                        <h5 className="font-semibold text-[var(--text-primary)] truncate text-sm md:text-base">
                            {currentUser?.name || "User"}
                        </h5>
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                            {currentUser?.email}
                        </p>
                    </div>
                )}
            </div>

            {/* menu */}
            <nav className="flex-1 overflow-y-auto space-y-1 custom-scrollbar text-sm">
                {menuData.map((item, idx) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => handleClick(item.path)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-500 shadow-sm font-semibold"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon className="text-lg flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="font-medium whitespace-nowrap truncate">
                                    {item.label}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>
        </div>
    );
};

export default SidebarContent;