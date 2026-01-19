import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectedUsers from "../../components/SelectedUsers";
import TodoListInput from "../../components/TodoListInput";
import AddAttachmentsInput from "../../components/AddAttachmentsInput";
import axiosInstance from "../../utils/axioInstance";
import moment from "moment";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { motion } from "framer-motion";

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: null,
        assignedTo: [],
        todoChecklist: [], // Array of strings (texts)
        attachments: [],
    });

    const [currentTask, setCurrentTask] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleValueChange = (key, value) =>
        setTaskData((prev) => ({ ...prev, [key]: value }));

    const clearData = () =>
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: null,
            assignedTo: [],
            todoChecklist: [],
            attachments: [],
        });

    // create
    const createTask = async () => {
        try {
            setLoading(true);
            
            // Send array of strings (texts)
            await axiosInstance.post("/tasks/create", {
                ...taskData,
                dueDate: taskData.dueDate
                    ? new Date(taskData.dueDate).toISOString()
                    : null,
                todoChecklist: taskData.todoChecklist, 
            });

            toast.success("Task created successfully!");
            clearData();
            navigate("/admin/tasks");
        } catch (err) {
            console.error("createTask:", err);
            toast.error("Error creating task");
        } finally {
            setLoading(false);
        }
    };

    // update
    const updateTask = async () => {
        try {
            setLoading(true);
            
            // Send array of strings (texts)
            await axiosInstance.put(`/tasks/${taskId}`, {
                ...taskData,
                dueDate: taskData.dueDate
                    ? new Date(taskData.dueDate).toISOString()
                    : null,
                todoChecklist: taskData.todoChecklist,
            });

            toast.success("Task updated successfully!");
            navigate("/admin/tasks");
        } catch (err) {
            console.error("updateTask:", err);
            toast.error("Error updating task");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setError("");

        if (!taskData.title.trim()) return setError("Title is required!");
        if (!taskData.description.trim())
            return setError("Description is required!");
        if (!taskData.dueDate) return setError("Due date is required!");
        if (!taskData.assignedTo?.length)
            return setError("Assign to at least one member!");
        if (!taskData.todoChecklist?.length)
            return setError("Add at least one todo item!");

        if (taskId) await updateTask();
        else await createTask();
    };

    // fetch single task
    const getTaskDetailsById = async () => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}`);
            if (res.data) {
                setCurrentTask(res.data);
                setTaskData({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    priority: res.data.priority || "Low",
                    dueDate: res.data.dueDate
                        ? new Date(res.data.dueDate)
                        : null,
                    assignedTo: res.data.assignedTo?.map((u) => u._id) || [],
                    // Extract only the text for the form input
                    todoChecklist:
                        res.data.todoChecklist?.map((t) => t.text) || [],
                    attachments: res.data.attachments || [],
                });
            }
        } catch (err) {
            console.error("getTaskDetailsById:", err);
            toast.error("Unable to fetch task");
        }
    };

    // delete (now archive)
    const deleteTask = async () => {
        try {
            setLoading(true);
            // Use DELETE method, but backend performs soft delete (archiving)
            await axiosInstance.delete(`/tasks/${taskId}`); 
            setOpenDeleteAlert(false);
            toast.success("Task archived successfully!");
            navigate("/admin/tasks");
        } catch (err) {
            console.error("deleteTask:", err);
            toast.error("Error archiving task");
        } finally {
            setLoading(false);
        }
    };

    const { currentWorkspace } = useSelector((state) => state.workspace);

    useEffect(() => {
        if (taskId && currentWorkspace) getTaskDetailsById();
        // eslint-disable-next-line
    }, [taskId, currentWorkspace]);

    return (
        <DashboardLayout activeMenu={"Create Task"}>
            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg text-gray-900"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {taskId ? "Update Task" : "Create New Task"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {taskId
                                    ? "Modify the task and update."
                                    : "Fill details to create a new task."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {taskId && (
                                <button
                                    onClick={() => setOpenDeleteAlert(true)}
                                    type="button"
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition"
                                >
                                    <MdDelete className="text-lg" /> Archive
                                </button>
                            )}

                            <button
                                onClick={() => navigate("/admin/tasks")}
                                className="px-3 py-1.5 rounded-md bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                                type="button"
                            >
                                Back to Tasks
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={taskData.title}
                                onChange={(e) =>
                                    handleValueChange("title", e.target.value)
                                }
                                placeholder="e.g. Fix slab cracks at sector 5"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={taskData.description}
                                onChange={(e) =>
                                    handleValueChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Add more details for the site engineer..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Priority & DueDate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={taskData.priority}
                                    onChange={(e) =>
                                        handleValueChange(
                                            "priority",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <DatePicker
                                    selected={taskData.dueDate}
                                    onChange={(d) =>
                                        handleValueChange("dueDate", d)
                                    }
                                    minDate={new Date()}
                                    placeholderText="Select due date"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </div>

                        {/* Assign To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To
                            </label>
                            <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                                <SelectedUsers
                                    selectedUser={taskData.assignedTo}
                                    setSelectedUser={(ids) =>
                                        handleValueChange("assignedTo", ids)
                                    }
                                />
                            </div>
                        </div>

                        {/* Todo checklist */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                TODO Checklist
                            </label>
                            <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                                <TodoListInput
                                    todoList={taskData.todoChecklist}
                                    setTodoList={(list) =>
                                        handleValueChange("todoChecklist", list)
                                    }
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attachments
                            </label>
                            <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                                <AddAttachmentsInput
                                    attachments={taskData.attachments}
                                    setAttachments={(arr) =>
                                        handleValueChange("attachments", arr)
                                    }
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-3 justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    clearData();
                                    navigate("/admin/tasks");
                                }}
                                className="px-4 py-2 rounded-md bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`px-4 py-2 rounded-md text-white font-semibold ${
                                    loading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >
                                {loading
                                    ? taskId
                                        ? "UPDATING..."
                                        : "CREATING..."
                                    : taskId
                                    ? "UPDATE TASK"
                                    : "CREATE TASK"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title={"Archive Task"}
            >
                <div className="bg-white p-4 rounded-md">
                    <DeleteAlert
                        content="Are you sure you want to archive this task? It will be hidden from the main task list."
                        onDelete={() => deleteTask()}
                    />
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default CreateTask;