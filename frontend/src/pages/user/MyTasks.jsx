import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";
import TaskFilterSort from "../../components/TaskFilterSort";
import { Search } from "lucide-react";


const MyTask = () => {
    const navigate = useNavigate();
    const workspaceState = useSelector((state) => state.workspace);
    const activeWorkspace = workspaceState?.currentWorkspace;

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
    const [searchTerm, setSearchTerm] = useState(""); 


    const getAllTasks = async () => {
        try {
            const endpoint = activeWorkspace ? "/tasks" : "/personal/tasks";
            
            const response = await axiosInstance.get(endpoint, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                    priority: filter.priority,
                    sort: sort,
                    search: searchTerm, 
                },
            });

            // Handle different response structures
            if (activeWorkspace) {
                 // Workspace Mode Response
                if (response?.data) {
                    setAllTasks(
                        response.data?.tasks?.length > 0 ? response.data.tasks : []
                    );
                }
                const statusSummary = response.data?.statusSummary || {};
                setTabs([
                    { label: "All", count: statusSummary.all || 0 },
                    { label: "Pending", count: statusSummary.pendingTasks || 0 },
                    { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                    { label: "Awaiting Verification", count: statusSummary.awaitingVerificationTasks || 0 },
                    { label: "Completed", count: statusSummary.completedTasks || 0 },
                ]);

            } else {
                // Personal Mode Response (/api/personal/tasks)
                // Response: { allTasks: [], grouped: { overdue: [], dueToday: [], upcoming: [], noDueDate: [] } }
                
                // For Personal Mode, we might want to display differently, but for now let's map it to the same list
                // To support status tabs, we'd need to count them manually from allTasks
                
                const tasks = response.data?.allTasks || [];
                setAllTasks(tasks);

                // Calculate counts manually for tabs
                const counts = {
                    all: tasks.length,
                    pending: tasks.filter(t => t.status === 'Pending').length,
                    inProgress: tasks.filter(t => t.status === 'InProgress').length,
                    awaiting: tasks.filter(t => t.status === 'AwaitingVerification').length,
                    completed: tasks.filter(t => t.status === 'Completed').length,
                };

                 setTabs([
                    { label: "All", count: counts.all },
                    { label: "Pending", count: counts.pending },
                    { label: "In Progress", count: counts.inProgress },
                    { label: "Awaiting Verification", count: counts.awaiting },
                    { label: "Completed", count: counts.completed },
                ]);
            }

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
                            {activeWorkspace ? `Tasks - ${activeWorkspace.name}` : "My Tasks (All Workspaces)"}
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
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 min-w-[200px] max-w-full sm:max-w-xs">
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
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
                                workspaceName={item.workspace?.name} // Pass workspace name
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