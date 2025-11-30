import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import { FaFileLines } from "react-icons/fa6";
import TaskCard from "../../components/TaskCard";
import toast from "react-hot-toast";

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);

    const [filterStatus, setFilterStatus] = useState("All");

    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get("/tasks", {
                params: { status: filterStatus === "All" ? "" : filterStatus },
            });

            // List of tasks
            if (response?.data) {
                setAllTasks(
                    response.data?.tasks?.length > 0 ? response.data.tasks : []
                );
            }

            // Tab summary data
            const summary = response.data?.statusSummary || {};

            setTabs([
                { label: "All", count: summary.all || 0 },
                { label: "Pending", count: summary.pendingTasks || 0 },
                { label: "In Progress", count: summary.inProgressTasks || 0 },
                { label: "Completed", count: summary.completedTasks || 0 },
            ]);
        } catch (error) {
            console.log("Error fetching tasks:", error);
        }
    };

    const handleClick = (taskData) => {
        navigate("/admin/create-task", { state: { taskId: taskData._id } });
    };

    // Download report file
    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get("/reports/export/tasks", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "tasks_details.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Error downloading task-details report:", error);
            toast.error("Error downloading report. Please try again!");
        }
    };

    useEffect(() => {
        getAllTasks(filterStatus);
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu={"Manage Task"}>
            <div className="my-6 px-4 sm:px-6 lg:px-8">
                {/* HEADER + SUBTITLE */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div className="w-full md:w-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
                            My Tasks
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Overview of site tasks and progress
                        </p>
                    </div>

                    {/* RIGHT SIDE WITH FILTER TABS + DOWNLOAD BUTTON */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        {/* Always visible Tabs */}
                        <TaskStatusTabs
                            tabs={tabs}
                            activeTab={filterStatus}
                            setActiveTab={setFilterStatus}
                        />

                        {/* Desktop Download Btn */}
                        <button
                            className="hidden md:flex items-center gap-2 px-4 py-2.5 
                         bg-gray-800 text-gray-200 border border-gray-700 
                         rounded-lg shadow-sm hover:bg-gray-700 transition"
                            onClick={handleDownloadReport}
                            type="button"
                        >
                            <FaFileLines className="text-lg text-yellow-300" />
                            <span>Download Report</span>
                        </button>

                        {/* Mobile Download Btn */}
                        <button
                            className="md:hidden px-4 py-2 bg-gray-800 hover:bg-gray-700 
                         text-gray-200 border border-gray-700 rounded-lg shadow-sm"
                            onClick={handleDownloadReport}
                            type="button"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* TASK LIST / EMPTY STATE */}
                {allTasks?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {allTasks.map((item) => (
                            <TaskCard
                                key={item._id}
                                title={item.title}
                                description={item.description}
                                priority={item.priority}
                                status={item.status}
                                progress={item.progress}
                                createdAt={item.createdAt}
                                dueDate={item.dueDate}
                                assignedTo={item.assignedTo?.map(
                                    (u) => u.profileImageUrl
                                )}
                                attachmentCount={item.attachments?.length || 0}
                                completedTodoCount={
                                    item.completedTodoCount || 0
                                }
                                todoChecklist={item.todoChecklist || []}
                                onClick={() => handleClick(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-16 text-gray-500 text-lg bg-gray-900/60
                          rounded-xl border border-gray-800 backdrop-blur-xl mt-6"
                    >
                        No tasks found for this filter.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageTasks;
