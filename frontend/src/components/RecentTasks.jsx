import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecentTasks = ({ tasks }) => {
    const navigate = useNavigate();

    const statusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700 border border-green-300";
            case "Pending":
                return "bg-red-100 text-red-700 border border-red-300";
            default:
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
        }
    };

    const priorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-50 text-red-600 border border-red-200";
            case "Medium":
                return "bg-yellow-50 text-yellow-600 border border-yellow-200";
            default:
                return "bg-gray-100 text-gray-600 border border-gray-300";
        }
    };

    return (
        <div className="bg-white mt-6 border border-gray-200 rounded-xl shadow-lg">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Recent Tasks
                </h3>

                <button
                    onClick={() => navigate("/admin/tasks")}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition p-2 rounded-md hover:bg-gray-100"
                >
                    See More →
                </button>
            </div>

            {/* TABLE */}
            <div className="p-4 overflow-x-auto">
                {tasks?.length ? (
                    <table className="w-full">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
                                <th className="py-3 text-left font-medium">Task Name</th>
                                <th className="py-3 text-left font-medium">Status</th>
                                <th className="py-3 text-left font-medium">Priority</th>
                                <th className="py-3 text-left font-medium">Created On</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr
                                    key={task._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 text-sm text-gray-800">
                                        {task.title}
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

                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColor(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td className="py-3 text-sm text-gray-500">
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