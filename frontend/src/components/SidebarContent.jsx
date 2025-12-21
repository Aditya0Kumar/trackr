import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import { motion } from "framer-motion";
import UserAvatar from "./UserAvatar";

const SidebarContent = ({ activeMenu, isCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        if (currentUser) {
            setMenuData(
                currentUser.role === "admin"
                    ? SIDE_MENU_DATA
                    : USER_SIDE_MENU_DATA
            );
        }
    }, [currentUser]);

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
        <div className="flex flex-col h-full text-gray-800">
            {/* profile */}
            <div className={`flex ${isCollapsed ? 'justify-center' : 'flex-col items-center'} mb-6 transition-all duration-300`}>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
                    <UserAvatar 
                        imageUrl={currentUser?.profileImageUrl} 
                        size="w-full h-full" 
                    />
                </div>
                {!isCollapsed && (
                    <div className="mt-3 text-center overflow-hidden">
                        <h5 className="font-semibold text-gray-900 truncate">
                            {currentUser?.name || "User"}
                        </h5>
                        <p className="text-xs text-gray-500 truncate">
                            {currentUser?.email}
                        </p>
                        {currentUser?.role === "admin" && (
                            <span className="mt-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium inline-block">
                                Admin
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* menu - Added overflow-y-auto and custom-scrollbar */}
            <nav className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {menuData.map((item, idx) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => handleClick(item.path)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-md font-semibold"
                                    : "text-gray-600 hover:bg-gray-100"
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon className="text-xl flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Logout Button (Removed redundant explicit sign out button) */}
        </div>
    );
};

export default SidebarContent;