import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";
import TaskFilterSort from "../../components/TaskFilterSort";
import { Search } from "lucide-react";

const MyTask = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([
        { label: "All", count: 0 },
        { label: "Pending", count: 0 },
        { label: "In Progress", count: 0 },
        { label: "Awaiting Verification", count: 0 },
        { label: "Completed", count: 0 },
    ]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filter, setFilter] = useState({ priority: "All" });
    const [sort, setSort] = useState("createdAtDesc");
    const [searchTerm, setSearchTerm] = useState(""); // New state for search

    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get("/tasks", {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                    priority: filter.priority,
                    sort: sort,
                    search: searchTerm, // Pass search term
                },
            });

            if (response?.data) {
                setAllTasks(
                    response.data?.tasks?.length > 0 ? response.data.tasks : []
                );
            }

            const statusSummary = response.data?.statusSummary || {};

            setTabs([
                { label: "All", count: statusSummary.all || 0 },
                { label: "Pending", count: statusSummary.pendingTasks || 0 },
                {
                    label: "In Progress",
                    count: statusSummary.inProgressTasks || 0,
                },
                {
                    label: "Awaiting Verification",
                    count: statusSummary.awaitingVerificationTasks || 0,
                },
                {
                    label: "Completed",
                    count: statusSummary.completedTasks || 0,
                },
            ]);
        } catch (error) {
            console.log("Error fetching tasks: ", error);
        }
    };

    const handleClick = (taskId) => {
        // User now navigates to the shared TaskDetails page
        navigate(`/task-details/${taskId}`);
    };

    useEffect(() => {
        getAllTasks();
    }, [filterStatus, filter.priority, sort, searchTerm]); // Re-fetch when search term changes

    return (
        <DashboardLayout activeMenu={"My Tasks"}>
            <div className="my-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div className="flex items-center justify-between gap-4 w-full md:w-auto ">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            My Tasks
                        </h2>
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
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {allTasks?.length > 0 ? (
                        allTasks?.map((item, index) => (
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
                                    (item) => item.profileImageUrl
                                )}
                                attachmentCount={item.attachments?.length || 0}
                                completedTodoCount={
                                    item.completedTodoCount || 0
                                }
                                todoChecklist={item.todoChecklist || []}
                                onClick={() => handleClick(item._id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl border border-gray-200 shadow-md">
                            <p className="text-gray-500">
                                No tasks found matching the current filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyTask;