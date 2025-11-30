import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data";
import { motion } from "framer-motion";

const SideMenu = ({ activeMenu }) => {
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
        <div className="h-full rounded-2xl p-5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 backdrop-blur-xl shadow-lg flex flex-col">
            {/* profile */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/40">
                    <img
                        src={
                            currentUser?.profileImageUrl ||
                            "/default-avatar.png"
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h5 className="mt-3 font-semibold text-white">
                    {currentUser?.name || "User"}
                </h5>
                <p className="text-xs text-gray-300">{currentUser?.email}</p>
                {currentUser?.role === "admin" && (
                    <span className="mt-2 px-2 py-0.5 text-xs rounded-full bg-indigo-900/40 text-indigo-200">
                        Admin
                    </span>
                )}
            </div>

            {/* menu */}
            <nav className="flex-1 overflow-y-auto space-y-2">
                {menuData.map((item, idx) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => handleClick(item.path)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                                isActive
                                    ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/30 text-indigo-300 shadow-xl"
                                    : "text-gray-300 hover:bg-white/3"
                            }`}
                        >
                            <item.icon className="text-xl" />
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    );
                })}
            </nav>

            <div className="mt-4">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg bg-white/3 text-white/90 hover:bg-white/5 transition"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default SideMenu;
