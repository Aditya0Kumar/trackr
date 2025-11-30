import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full py-4 px-6 flex items-center justify-between bg-transparent z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="lg:hidden p-2 rounded-md bg-white/3 hover:bg-white/5"
                >
                    <MdMenu className="text-2xl text-white/90" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                        {/* Logo placeholder */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-white"
                        >
                            <path
                                d="M4 12h7l3 8 2-14 4 10"
                                stroke="white"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                        Trackr
                    </h1>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <div className="text-sm text-gray-300">
                    Daily progress • Live updates
                </div>
                <button className="px-3 py-2 rounded-lg bg-white/3 hover:bg-white/5">
                    Help
                </button>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative z-50 w-72 p-6"
                    >
                        <SideMenu activeMenu={activeMenu} />
                        <button
                            className="mt-4 w-full px-4 py-2 rounded-lg bg-white/3"
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
