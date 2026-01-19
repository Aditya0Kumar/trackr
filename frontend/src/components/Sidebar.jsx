import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent";

const Sidebar = ({ activeMenu, isCollapsed, onToggleCollapse }) => {
    
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
                h-full 
                ${sidebarWidth} 
                bg-[var(--bg-secondary)]
                border-r border-[var(--border-color)]
                flex-shrink-0
                transition-all duration-300
                z-10
            `}
        >
            <div className={`h-full flex flex-col ${paddingX} py-3 transition-all duration-300`}>
                {/* Toggle Button */}
                <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-2 shrink-0`}>
                    <button
                        onClick={handleToggle}
                        className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <SidebarContent activeMenu={activeMenu} isCollapsed={isCollapsed} />
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;