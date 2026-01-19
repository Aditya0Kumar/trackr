import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RecentTasks = ({ tasks }) => {
    const navigate = useNavigate();
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const statusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700 border border-green-300";
            case "Pending":
                return "bg-blue-100 text-blue-700 border border-blue-300"; // Changed to Blue for standard Pending
            case "In Progress":
                 return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "Awaiting Verification":
                 return "bg-orange-100 text-orange-700 border border-orange-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    const priorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-50 text-red-600 border border-red-200";
            case "Medium":
                return "bg-yellow-50 text-yellow-600 border border-yellow-200";
            default:
                return "bg-green-50 text-green-600 border border-green-200"; // Changed Low to Green
        }
    };

    const getDueDateStyle = (date) => {
        if (!date) return "text-gray-500";
        
        const now = moment().startOf('day');
        const due = moment(date).startOf('day');
        
        if (due.isBefore(now)) {
            return "text-red-600 font-bold"; // Overdue
        } else if (due.isSame(now)) {
            return "text-orange-600 font-bold"; // Due Today
        } else {
            return "text-gray-700"; // Upcoming
        }
    };

    const formatDueDate = (date) => {
        if (!date) return "No Due Date";
        const now = moment().startOf('day');
        const due = moment(date).startOf('day');

        if (due.isSame(now)) return "Today";
        if (due.isSame(moment(now).add(1, 'days'))) return "Tomorrow";
        
        return moment(date).format("MMM Do");
    };

    return (
        <div className="bg-white mt-6 border border-gray-200 rounded-xl shadow-lg">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Top Priorities
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Tasks requiring your immediate attention
                    </p>
                </div>

                <button
                    onClick={() => navigate(currentWorkspace ? "/admin/tasks" : "/user/tasks")}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition p-2 rounded-md hover:bg-gray-100"
                >
                    View All →
                </button>
            </div>

            {/* TABLE */}
            <div className="p-4 overflow-x-auto">
                {tasks?.length ? (
                    <table className="w-full">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
                                <th className="py-3 text-left font-medium pl-2">Task</th>
                                {/* In Personal Mode (no currentWorkspace), show Workspace Column */}
                                {!currentWorkspace && (
                                    <th className="py-3 text-left font-medium">Workspace</th>
                                )}
                                <th className="py-3 text-left font-medium">Due Date</th>
                                <th className="py-3 text-left font-medium">Priority</th>
                                <th className="py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr
                                    key={task._id}
                                    onClick={() => navigate(`/user/task-details/${task._id}`)}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="py-3 pl-2 text-sm font-medium text-gray-800">
                                        {task.title}
                                    </td>

                                    {!currentWorkspace && (
                                        <td className="py-3 text-sm text-gray-500">
                                            {task.workspace?.name || "N/A"}
                                        </td>
                                    )}

                                    <td className={`py-3 text-sm ${getDueDateStyle(task.dueDate)}`}>
                                        {formatDueDate(task.dueDate)}
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColor(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority || "Low"}
                                        </span>
                                    </td>
                                    
                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor(
                                                task.status
                                            )}`}
                                        >
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-sm">
                            No upcoming tasks found. You're all caught up!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTasks;