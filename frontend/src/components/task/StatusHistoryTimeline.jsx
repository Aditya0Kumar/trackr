import React from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Loader, AlertTriangle } from "lucide-react";
import UserAvatar from "../UserAvatar";

const getStatusIcon = (status) => {
    switch (status) {
        case "Completed":
            return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" };
        case "In Progress":
            return { icon: Loader, color: "text-blue-600", bg: "bg-blue-100" };
        case "Awaiting Verification":
            return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" };
        case "Pending":
            return { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" };
        default:
            return { icon: Clock, color: "text-gray-600", bg: "bg-gray-100" };
    }
};

const StatusHistoryTimeline = ({ history = [] }) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 bg-white rounded-xl border border-gray-200">
                No status history recorded yet.
            </div>
        );
    }

    // Reverse the history to show the newest entry first
    const reversedHistory = [...history].reverse();

    return (
        <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />

            {reversedHistory.map((item, index) => {
                const { icon: Icon, color, bg } = getStatusIcon(item.status);
                const isLast = index === reversedHistory.length - 1;

                return (
                    <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                Status changed to 
                                <span className={`font-bold ml-1 ${color}`}>
                                    {item.status}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default StatusHistoryTimeline;