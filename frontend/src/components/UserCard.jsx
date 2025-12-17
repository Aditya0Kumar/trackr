import React from "react";
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const UserCard = ({ userInfo, onClick }) => {
    const navigate = useNavigate();

    const handleViewTasks = (e) => {
        e.stopPropagation(); // Prevent card click from triggering modal
        navigate(`/admin/tasks?userId=${userInfo._id}&userName=${userInfo.name}`);
    };

    return (
        <motion.div
            onClick={onClick} // Added onClick handler
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-xl bg-white border border-gray-200 
                    shadow-md transition hover:border-indigo-400 flex flex-col cursor-pointer"
        >
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                <UserAvatar
                    imageUrl={userInfo?.profileImageUrl}
                    size="h-16 w-16"
                />

                <div>
                    <p className="text-lg font-semibold text-gray-900">
                        {userInfo?.name}
                    </p>
                    <p className="text-sm text-gray-500">{userInfo?.email}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <StatPill
                    label="Total Tasks"
                    count={userInfo?.totalTasks || 0}
                    color="bg-indigo-100 text-indigo-700 border-indigo-300"
                />
                <StatPill
                    label="Completed"
                    count={userInfo?.completedTasks || 0}
                    color="bg-green-100 text-green-700 border-green-300"
                />
                <StatPill
                    label="Overdue"
                    count={userInfo?.overdueTasks || 0}
                    color="bg-red-100 text-red-700 border-red-300"
                />
                <StatPill
                    label="Rate"
                    count={`${userInfo?.completionRate || 0}%`}
                    color="bg-blue-100 text-blue-700 border-blue-300"
                />
            </div>

            {/* Action Button - Now triggers task view via separate handler */}
            <button
                onClick={handleViewTasks}
                className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 
                       bg-indigo-600 text-white rounded-lg shadow-md 
                       hover:bg-indigo-700 transition text-sm font-medium"
            >
                View Assigned Tasks
                <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default UserCard;

// Status Pill
const StatPill = ({ label, count, color }) => {
    return (
        <div
            className={`flex flex-col items-start p-3 border rounded-xl ${color}`}
        >
            <span className="text-xl font-bold leading-none">{count}</span>
            <span className="text-xs font-medium mt-1">{label}</span>
        </div>
    );
};