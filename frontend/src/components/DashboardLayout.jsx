import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { setSidebarCollapse } from "../redux/slice/uiSlice";

const DashboardLayout = ({ children, activeMenu }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { isSidebarCollapsed } = useSelector((state) => state.ui); // Get state from Redux
    const dispatch = useDispatch();

    const handleToggleCollapse = (isCollapsed) => {
        dispatch(setSidebarCollapse(isCollapsed));
    };

    // Calculate dynamic margin based on sidebar state
    // Expanded sidebar width: w-64 (16rem) + left-5 (1.25rem) + right-5 (1.25rem) = 18.5rem
    // Collapsed sidebar width: w-20 (5rem) + left-5 (1.25rem) + right-5 (1.25rem) = 7.5rem
    // We use min-[1080px] breakpoint for desktop layout
    const contentMarginClass = isSidebarCollapsed
        ? "min-[1080px]:ml-[7.5rem]" // 5rem (w-20) + 2.5rem (mx-5) = 7.5rem
        : "min-[1080px]:ml-[18.5rem]"; // 16rem (w-64) + 2.5rem (mx-5) = 18.5rem

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 text-gray-900">
            <Navbar activeMenu={activeMenu} />

            {currentUser && (
                <div className="flex flex-1 pt-5">
                    {/* Desktop Sidebar (Fixed) */}
                    <Sidebar 
                        activeMenu={activeMenu} 
                        isCollapsed={isSidebarCollapsed} // Pass state down
                        onToggleCollapse={handleToggleCollapse} // Use Redux dispatcher
                    />

                    {/* Content area */}
                    <div className={`
                        grow 
                        mx-5 
                        ${contentMarginClass} 
                        min-[1080px]:mr-5
                        bg-white 
                        min-h-[calc(100vh-80px)] 
                        rounded-xl 
                        p-4 
                        shadow-lg 
                        border border-gray-200
                        transition-all duration-300
                    `}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;