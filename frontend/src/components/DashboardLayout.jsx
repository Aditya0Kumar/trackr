import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { setSidebarCollapse } from "../redux/slice/uiSlice";
import { setCurrentWorkspace } from "../redux/slice/workspaceSlice";
import axiosInstance from "../utils/axioInstance";
import { useEffect } from "react";

const DashboardLayout = ({ children, activeMenu }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { isSidebarCollapsed } = useSelector((state) => state.ui); // Get state from Redux
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const dispatch = useDispatch();

    const handleToggleCollapse = (isCollapsed) => {
        dispatch(setSidebarCollapse(isCollapsed));
    };

    // Auto-refresh workspace role to ensure UI is in sync
    useEffect(() => {
        const fetchWorkspaceDetails = async () => {
            if (currentWorkspace?._id) {
                try {
                    const res = await axiosInstance.get(`/workspaces/${currentWorkspace._id}/summary`);
                    // Update Redux if role mismatch (or just update always to be safe)
                    if (res.data.role !== currentWorkspace.role) {
                        dispatch(setCurrentWorkspace({ ...currentWorkspace, role: res.data.role }));
                    }
                } catch (error) {
                    console.error("Failed to refresh workspace details", error);
                }
            }
        };

        if (currentWorkspace) {
            fetchWorkspaceDetails();
        }
    }, [currentWorkspace?._id, dispatch]); // Only trigger if ID changes or on mount

    // Calculate dynamic margin based on sidebar state
    // Expanded sidebar width: w-64 (16rem) + left-5 (1.25rem) + right-5 (1.25rem) = 18.5rem
    // Collapsed sidebar width: w-20 (5rem) + left-5 (1.25rem) + right-5 (1.25rem) = 7.5rem
    // We use min-[1080px] breakpoint for desktop layout
    const contentMarginClass = isSidebarCollapsed
        ? "min-[1080px]:ml-[7.5rem]" // 5rem (w-20) + 2.5rem (mx-5) = 7.5rem
        : "min-[1080px]:ml-[18.5rem]"; // 16rem (w-64) + 2.5rem (mx-5) = 18.5rem


    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
             <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Navbar activeMenu={activeMenu} />

                {currentUser && (
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar (Flex Item) */}
                        <Sidebar 
                            activeMenu={activeMenu} 
                            isCollapsed={isSidebarCollapsed} 
                            onToggleCollapse={handleToggleCollapse} 
                        />

                        {/* Content Area (Flex Grow) */}
                        <main className="
                            flex-1 
                            overflow-y-auto 
                            bg-[var(--bg-secondary)] 
                            m-2 rounded-xl 
                            shadow-inner 
                            border border-[var(--border-color)]
                            relative
                            p-4
                        ">
                             {children}
                        </main>
                    </div>
                )}
             </div>
        </div>
    );
};

export default DashboardLayout;