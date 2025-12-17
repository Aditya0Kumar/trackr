import React from "react";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent";

const Sidebar = ({ activeMenu, isCollapsed, onToggleCollapse }) => {
    // State is now managed by the parent (DashboardLayout)

    const handleToggle = () => {
        onToggleCollapse(!isCollapsed);
    };

    const sidebarWidth = isCollapsed ? "w-20" : "w-64";
    const paddingX = isCollapsed ? "px-2" : "px-5";

    return (
        <motion.div
            // Removed initial prop to prevent unwanted animation on remount/navigation
            animate={{ width: isCollapsed ? "5rem" : "16rem" }}
            transition={{ duration: 0.3 }}
            className={`
                hidden min-[1080px]:block 
                h-[calc(100vh-80px)] 
                fixed top-20 left-5 
                ${sidebarWidth} 
                bg-white 
                rounded-2xl 
                shadow-xl 
                border border-gray-200 
                z-10 
                flex-shrink-0
                overflow-hidden
            `}
        >
            <div className={`h-full flex flex-col ${paddingX} py-5 transition-all duration-300`}>
                {/* Toggle Button */}
                <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-4`}>
                    <button
                        onClick={handleToggle}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <SidebarContent activeMenu={activeMenu} isCollapsed={isCollapsed} />
            </div>
        </motion.div>
    );
};

export default Sidebar;