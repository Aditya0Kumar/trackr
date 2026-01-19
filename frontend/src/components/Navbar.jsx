import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent";
import Logo from "../assets/logo.png";
import NotificationDropdown from "./NotificationDropdown";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

const Navbar = ({ activeMenu }) => {
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    return (
        <header className="w-full py-4 px-6 flex items-center justify-between bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-20 shadow-sm sticky top-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="min-[1080px]:hidden p-2 rounded-md bg-[var(--hover-bg)] hover:opacity-80 text-[var(--text-primary)] transition-colors"
                >
                    <MdMenu className="text-2xl" />
                </button>

                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Trackr Logo" className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">
                        Trackr
                    </h1>
                    {/* Workspace Switcher in Navbar */}
                    <div className="hidden md:block">
                         <WorkspaceSwitcher className="mb-0 w-60" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User Profile Link */}
                <Link to="/profile" className="flex items-center gap-3 p-1 rounded-full hover:bg-[var(--hover-bg)] transition text-[var(--text-primary)]">
                    <UserAvatar 
                        imageUrl={currentUser?.profileImageUrl} 
                        size="w-8 h-8" 
                    />
                    <span className="hidden md:inline text-sm font-medium">
                        {currentUser?.name}
                    </span>
                </Link>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 flex min-[1080px]:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-50 w-72 p-6 bg-white bg-[var(--bg-secondary)] h-screen shadow-2xl flex flex-col border-r border-[var(--border-color)]"
                    >
                        <div className="mb-4">
                            <WorkspaceSwitcher className="mb-0" />
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <SidebarContent activeMenu={activeMenu} isCollapsed={false} />
                        </div>
                        <button
                            className="mt-4 w-full px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-primary)] hover:opacity-90 shrink-0 font-medium transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </header>
    );
};

export default Navbar;