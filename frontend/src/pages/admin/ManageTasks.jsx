import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import DashboardLayout from "../../components/DashboardLayout";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import { FaFileLines } from "react-icons/fa6";
import TaskCard from "../../components/TaskCard";
import toast from "react-hot-toast";
import TaskFilterSort from "../../components/TaskFilterSort";
import { Search, Archive, ListChecks, ArchiveRestore, Trash2 } from "lucide-react";

const ManageTasks = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const userId = query.get("userId");
    const userName = query.get("userName");

    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);

    const [filterStatus, setFilterStatus] = useState("All");
    const [filter, setFilter] = useState({ priority: "All" });
    const [sort, setSort] = useState("createdAtDesc");
    const [searchTerm, setSearchTerm] = useState("");
    const [showArchived, setShowArchived] = useState(false); // New state for archive filter

    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get("/tasks", {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                    priority: filter.priority,
                    sort: sort,
                    userId: userId,
                    search: searchTerm,
                    archived: showArchived, // Pass archive filter
                },
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
                { label: "Awaiting Verification", count: summary.awaitingVerificationTasks || 0 },
                { label: "Completed", count: summary.completedTasks || 0 },
            ]);
        } catch (error) {
            console.log("Error fetching tasks:", error);
        }
    };

    const handleArchive = async (taskId, e) => {
        e.stopPropagation(); // Prevent card click navigation
        if (!window.confirm("Are you sure you want to archive this task? It will be moved to the archive list.")) return;
        
        try {
            // We use DELETE /tasks/:id which is mapped to archiveTask on the backend
            await axiosInstance.delete(`/tasks/${taskId}`);
            toast.success("Task archived successfully!");
            getAllTasks(); // Refresh list
        } catch (error) {
            console.error("Error archiving task:", error);
            toast.error("Failed to archive task.");
        }
    };

    const handleUnarchive = async (taskId, e) => {
        e.stopPropagation(); // Prevent card click navigation
        try {
            await axiosInstance.put(`/tasks/${taskId}/unarchive`);
            toast.success("Task restored successfully!");
            getAllTasks(); // Refresh list
        } catch (error) {
            console.error("Error unarchiving task:", error);
            toast.error("Failed to restore task.");
        }
    };

    const handleClick = (taskData) => {
        navigate(`/task-details/${taskData._id}`);
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

    const { currentWorkspace } = useSelector((state) => state.workspace);

    useEffect(() => {
        if (currentWorkspace) {
            getAllTasks();
        }
    }, [currentWorkspace, filterStatus, filter.priority, sort, userId, searchTerm, showArchived]);

    const handleClearFilter = () => {
        navigate("/admin/tasks"); // Navigate back to the base URL to clear user filters
    };

    const handleToggleArchived = () => {
        setShowArchived(prev => !prev);
        setFilterStatus("All"); // Reset status filter when toggling archive view
    };

    return (
        <DashboardLayout activeMenu={"Manage Task"}>
            <div className="my-6 px-4 sm:px-6 lg:px-8">
                {/* HEADER + SUBTITLE */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div className="w-full md:w-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {userId ? `Tasks Assigned to ${userName}` : "Manage Tasks"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {userId ? `Viewing tasks for ${userName}.` : "Overview of site tasks and progress"}
                        </p>
                    </div>

                    {/* RIGHT SIDE WITH FILTER TABS + DOWNLOAD BUTTON */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        {userId && (
                            <button
                                className="flex items-center gap-2 px-4 py-2.5 
                                bg-red-50 text-red-700 border border-red-300 
                                rounded-lg shadow-sm hover:bg-red-100 transition text-sm font-medium"
                                onClick={handleClearFilter}
                                type="button"
                            >
                                Clear User Filter
                            </button>
                        )}
                        
                        {/* Archive Toggle Button */}
                        <button
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm transition text-sm font-medium ${
                                showArchived
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={handleToggleArchived}
                            type="button"
                        >
                            {showArchived ? (
                                <>
                                    <ListChecks className="w-4 h-4" />
                                    View Active Tasks
                                </>
                            ) : (
                                <>
                                    <Archive className="w-4 h-4" />
                                    View Archived Tasks
                                </>
                            )}
                        </button>

                        {/* Download Btn */}
                        <button
                            className="flex items-center gap-2 px-4 py-2.5 
                         bg-white text-gray-700 border border-gray-300 
                         rounded-lg shadow-sm hover:bg-gray-100 transition"
                            onClick={handleDownloadReport}
                            type="button"
                        >
                            <FaFileLines className="text-lg text-indigo-500" />
                            <span>Download Report</span>
                        </button>
                    </div>
                </div>

                {/* FILTER/SORT & STATUS TABS */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <TaskStatusTabs
                        tabs={tabs}
                        activeTab={filterStatus}
                        setActiveTab={setFilterStatus}
                    />
                    
                    {/* Search Input and Filter/Sort */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search tasks by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <TaskFilterSort
                            filter={filter}
                            setFilter={setFilter}
                            sort={sort}
                            setSort={setSort}
                        />
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
                                actionButton={showArchived ? (
                                    <button
                                        onClick={(e) => handleUnarchive(item._id, e)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 border border-green-300 text-green-700 text-xs font-medium hover:bg-green-200 transition"
                                        type="button"
                                    >
                                        <ArchiveRestore className="w-4 h-4" />
                                        Restore
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => handleArchive(item._id, e)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition"
                                        type="button"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Archive
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-16 text-gray-500 text-lg bg-white
                          rounded-xl border border-gray-200 shadow-md mt-6"
                    >
                        {showArchived ? "No archived tasks found." : "No active tasks found for this filter."}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageTasks;