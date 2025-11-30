import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecentTasks = ({ tasks }) => {
    const navigate = useNavigate();

    const statusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-900/40 text-green-300 border border-green-700";
            case "Pending":
                return "bg-red-900/40 text-red-300 border border-red-700";
            default:
                return "bg-yellow-900/40 text-yellow-300 border border-yellow-700";
        }
    };

    const priorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-900/40 text-red-300 border border-red-700";
            case "Medium":
                return "bg-yellow-900/40 text-yellow-300 border border-yellow-700";
            default:
                return "bg-gray-800 text-gray-300 border border-gray-600";
        }
    };

    return (
        <div className="bg-gray-900/40 mt-20 backdrop-blur-xl border border-gray-800 rounded-xl shadow-lg">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-200">
                    Recent Tasks
                </h3>

                <button
                    onClick={() => navigate("/admin/tasks")}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition p-2 rounded-md hover:bg-gray-800/50"
                >
                    See More →
                </button>
            </div>

            {/* TABLE */}
            <div className="p-4 overflow-x-auto">
                {tasks?.length ? (
                    <table className="w-full">
                        <thead>
                            <tr className="text-gray-400 text-xs uppercase">
                                <th className="py-2 text-left">Task Name</th>
                                <th className="py-2 text-left">Status</th>
                                <th className="py-2 text-left">Priority</th>
                                <th className="py-2 text-left">Created On</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr
                                    key={task._id}
                                    className="border-b border-gray-800 hover:bg-gray-800/40"
                                >
                                    <td className="py-3 text-sm text-gray-200">
                                        {task.title}
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${statusColor(
                                                task.status
                                            )}`}
                                        >
                                            {task.status}
                                        </span>
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${priorityColor(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td className="py-3 text-sm text-gray-400">
                                        {moment(task.createdAt).format(
                                            "MMM Do, YYYY"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center py-6">
                        No recent tasks found
                    </p>
                )}
            </div>
        </div>
    );
};

export default RecentTasks;
