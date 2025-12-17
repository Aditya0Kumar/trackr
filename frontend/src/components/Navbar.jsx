import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent"; // Use SidebarContent
import Logo from "../assets/logo.png";
import NotificationDropdown from "./NotificationDropdown";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = ({ activeMenu }) => {
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    return (
        <header className="w-full py-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 z-20 shadow-sm sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="min-[1080px]:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                    <MdMenu className="text-2xl" />
                </button>

                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Trackr Logo" className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-gray-900">
                        Trackr
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* User Profile Link */}
                <Link to="/profile" className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition">
                    <UserAvatar 
                        imageUrl={currentUser?.profileImageUrl} 
                        size="w-8 h-8" 
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                        {currentUser?.name}
                    </span>
                </Link>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 flex min-[1080px]:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative z-50 w-72 p-6 bg-white h-full shadow-2xl"
                    >
                        <SidebarContent activeMenu={activeMenu} isCollapsed={false} />
                        <button
                            className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
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