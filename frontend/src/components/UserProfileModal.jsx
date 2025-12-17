import React from "react";
import Modal from "./Modal";
import UserAvatar from "./UserAvatar";
import { Mail, Briefcase, CalendarCheck, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4"
    >
        <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    </motion.div>
);

const UserProfileModal = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const handleViewTasks = () => {
        onClose();
        navigate(`/admin/tasks?userId=${user._id}&userName=${user.name}`);
    };

    const stats = [
        {
            icon: Briefcase,
            label: "Total Assigned Tasks",
            value: user.totalTasks || 0,
            color: { bg: "bg-indigo-100", text: "text-indigo-600" },
        },
        {
            icon: Clock,
            label: "Pending Tasks",
            value: user.pendingTasks || 0,
            color: { bg: "bg-red-100", text: "text-red-600" },
        },
        {
            icon: CalendarCheck,
            label: "Completed Tasks",
            value: user.completedTasks || 0,
            color: { bg: "bg-green-100", text: "text-green-600" },
        },
        {
            icon: TrendingUp,
            label: "Completion Rate",
            value: `${user.completionRate || 0}%`,
            color: { bg: "bg-blue-100", text: "text-blue-600" },
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Profile: ${user.name}`}
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col items-center text-center border-b border-gray-100 pb-4">
                    <UserAvatar imageUrl={user.profileImageUrl} size="w-24 h-24" />
                    <h3 className="text-2xl font-bold text-gray-900 mt-3">{user.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {user.email}
                    </p>
                    <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Team Member'}
                    </span>
                </div>

                {/* Task Statistics Grid */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Task Performance</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={handleViewTasks}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 
                               bg-indigo-600 text-white rounded-xl shadow-md 
                               hover:bg-indigo-700 transition text-sm font-medium"
                    >
                        View Assigned Tasks
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UserProfileModal;