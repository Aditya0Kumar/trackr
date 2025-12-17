import React, { useState } from "react";
import { Bell, CheckCircle, MessageSquare, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useNotifications from "../hooks/useNotifications";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, loading, markAsRead } = useNotifications();
    const navigate = useNavigate();

    const getIcon = (type) => {
        switch (type) {
            case "task_assigned":
                return <UserPlus className="w-4 h-4 text-indigo-600" />;
            case "status_change":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "new_comment":
                return <MessageSquare className="w-4 h-4 text-blue-600" />;
            default:
                return <Bell className="w-4 h-4 text-gray-600" />;
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }
        setIsOpen(false);
        // Navigate to the task details page
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 relative transition"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500 text-xs text-white flex items-center justify-center">
                        {/* {unreadCount} */}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 origin-top-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h4 className="font-semibold text-gray-900">Notifications</h4>
                            <button
                                onClick={() => markAsRead("all")}
                                className="text-xs text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                            ) : notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex items-start gap-3 p-3 cursor-pointer border-b border-gray-100 transition ${
                                            n.read ? "bg-white hover:bg-gray-50" : "bg-indigo-50 hover:bg-indigo-100"
                                        }`}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${n.read ? "text-gray-700" : "font-medium text-gray-900"}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {moment(n.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    You're all caught up!
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;