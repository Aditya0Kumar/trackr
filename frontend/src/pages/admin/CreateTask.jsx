import React, { useEffect, useState } from "react";
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
        todoChecklist: [],
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
            const todolist = (taskData.todoChecklist || []).map((t) => ({
                text: t,
                completed: false,
            }));

            await axiosInstance.post("/tasks/create", {
                ...taskData,
                dueDate: taskData.dueDate
                    ? new Date(taskData.dueDate).toISOString()
                    : null,
                todoChecklist: todolist,
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
            const todolist = (taskData.todoChecklist || []).map((text) => {
                const prev = currentTask?.todoChecklist || [];
                const matched = prev.find((p) => p.text === text);
                return { text, completed: matched ? matched.completed : false };
            });

            await axiosInstance.put(`/tasks/${taskId}`, {
                ...taskData,
                dueDate: taskData.dueDate
                    ? new Date(taskData.dueDate).toISOString()
                    : null,
                todoChecklist: todolist,
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

    // delete
    const deleteTask = async () => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/tasks/${taskId}`);
            setOpenDeleteAlert(false);
            toast.success("Task deleted");
            navigate("/admin/tasks");
        } catch (err) {
            console.error("deleteTask:", err);
            toast.error("Error deleting task");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) getTaskDetailsById();
        // eslint-disable-next-line
    }, [taskId]);

    return (
        <DashboardLayout activeMenu={"Create Task"}>
            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg text-white"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {taskId ? "Update Task" : "Create New Task"}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
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
                                    className="flex items-center gap-2 text-red-400 hover:text-red-500"
                                >
                                    <MdDelete className="text-lg" /> Delete
                                </button>
                            )}

                            <button
                                onClick={() => navigate("/admin/tasks")}
                                className="px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-white hover:bg-gray-800/90"
                                type="button"
                            >
                                Back to Tasks
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-md border border-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={taskData.title}
                                onChange={(e) =>
                                    handleValueChange("title", e.target.value)
                                }
                                placeholder="e.g. Fix slab cracks at sector 5"
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Priority & DueDate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
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
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Due Date
                                </label>
                                <DatePicker
                                    selected={taskData.dueDate}
                                    onChange={(d) =>
                                        handleValueChange("dueDate", d)
                                    }
                                    minDate={new Date()}
                                    placeholderText="Select due date"
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </div>

                        {/* Assign To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Assign To
                            </label>
                            <div className="bg-gray-900/50 border border-gray-800 rounded-md p-3">
                                <SelectedUsers
                                    selectedUser={taskData.assignedTo}
                                    setSelectedUser={(ids) =>
                                        handleValueChange("assignedTo", ids)
                                    }
                                    dark
                                />
                            </div>
                        </div>

                        {/* Todo checklist */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                TODO Checklist
                            </label>
                            <div className="bg-gray-900/50 border border-gray-800 rounded-md p-3">
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
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Attachments
                            </label>
                            <div className="bg-gray-900/50 border border-gray-800 rounded-md p-3">
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
                                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-800/90"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`px-4 py-2 rounded-md text-white font-semibold ${
                                    loading
                                        ? "bg-gray-700 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
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
                title={"Delete Task"}
            >
                <div className="bg-black/40 backdrop-blur-lg p-4 rounded-md">
                    <DeleteAlert
                        content="Are you sure you want to delete this task?"
                        onDelete={() => deleteTask()}
                    />
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default CreateTask;
