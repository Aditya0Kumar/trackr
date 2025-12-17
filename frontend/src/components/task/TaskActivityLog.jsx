import React from "react";
import moment from "moment";
import { motion } from "framer-motion";
import {
    CheckCircle, Clock, Loader, AlertTriangle,
    PlusCircle, Edit, Users, Paperclip, ListChecks, MessageSquare, XCircle
} from "lucide-react";
import UserAvatar from "../UserAvatar";

const getActivityIcon = (action) => {
    switch (action) {
        case "created_task":
            return { icon: PlusCircle, color: "text-indigo-600", bg: "bg-indigo-100" };
        case "updated_title":
        case "updated_description":
        case "changed_priority":
        case "changed_due_date":
            return { icon: Edit, color: "text-blue-600", bg: "bg-blue-100" };
        case "assigned_user":
        case "unassigned_user":
            return { icon: Users, color: "text-purple-600", bg: "bg-purple-100" };
        case "added_attachments":
        case "removed_attachments":
            return { icon: Paperclip, color: "text-gray-600", bg: "bg-gray-100" };
        case "added_todo_item":
        case "removed_todo_item":
            return { icon: ListChecks, color: "text-teal-600", bg: "bg-teal-100" };
        case "completed_todo":
            return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" };
        case "uncompleted_todo":
            return { icon: XCircle, color: "text-red-600", bg: "bg-red-100" };
        case "verified_todo":
            return { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" };
        case "unverified_todo":
            return { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" };
        case "changed_status":
            return { icon: Loader, color: "text-orange-600", bg: "bg-orange-100" };
        case "added_comment":
            return { icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-100" };
        default:
            return { icon: Clock, color: "text-gray-600", bg: "bg-gray-100" };
    }
};

const TaskActivityLog = ({ activityLog = [] }) => {
    if (!activityLog || activityLog.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 bg-white rounded-xl border border-gray-200">
                No activity recorded yet.
            </div>
        );
    }

    // Reverse the log to show the newest entry first
    const reversedLog = [...activityLog].reverse();

    return (
        <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />

            {reversedLog.map((item, index) => {
                const { icon: Icon, color, bg } = getActivityIcon(item.action);

                return (
                    <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="relative mb-6"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${bg}`}>
                            <Icon className={`w-3 h-3 ${color}`} />
                        </div>

                        {/* Content Card */}
                        <div className="ml-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <UserAvatar 
                                        imageUrl={item.user?.profileImageUrl} 
                                        size="w-6 h-6" 
                                    />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {item.user?.name || "System"}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {moment(item.createdAt).fromNow()}
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-700">
                                {item.details || item.action.replace(/_/g, ' ')}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TaskActivityLog;