import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import DashboardLayout from "../../components/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { FaExternalLinkAlt } from "react-icons/fa";
import CommentSection from "../../components/CommentSection";
import { useSelector } from "react-redux";
import { Edit, CheckCircle, Clock, Loader, AlertTriangle } from "lucide-react";
import TaskActivityLog from "../../components/task/TaskActivityLog"; // Import new Activity Log
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { STATUS_DATA } from "../../utils/data";
import TodoChecklistItem from "../../components/task/TodoChecklistItem";

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [task, setTask] = useState(null);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const getStatusTagColor = (status) => {
        switch (status) {
            case "In Progress":
                return "text-blue-700 bg-blue-100 border border-blue-300";
            case "Completed":
                return "text-green-700 bg-green-100 border border-green-300";
            case "Awaiting Verification":
                return "text-orange-700 bg-orange-100 border border-orange-300";
            default:
                return "text-yellow-700 bg-yellow-100 border border-yellow-300";
        }
    };

    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(`/tasks/${id}`);

            if (response.data) {
                const taskInfo = response.data;
                setTask(taskInfo);
            }
        } catch (error) {
            console.log("Error fetching task details: ", error);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === task?.status) return;

        setIsUpdatingStatus(true);
        setIsStatusDropdownOpen(false);

        try {
            const response = await axiosInstance.put(`/tasks/${id}/status`, {
                status: newStatus,
            });

            if (response.status === 200) {
                setTask(response.data?.task || task);
                toast.success(`Status updated to ${newStatus}!`);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to update status.";
            toast.error(errorMessage);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleLinkClick = (link) => {
        if (!/^https?:\/\//i.test(link)) {
            link = "https://" + link;
        }

        window.open(link, "_blank");
    };

    const handleEditClick = () => {
        navigate("/admin/create-task", { state: { taskId: id } });
    };

    const { currentWorkspace } = useSelector((state) => state.workspace);

    useEffect(() => {
        if (id) {
            getTaskDetailsById();
        }
    }, [id]);

    const activeMenu =
        currentUser?.role === "admin" ? "Manage Task" : "My Tasks";
    const isAdmin = currentUser?.role === "admin";
    const isAssigned = task?.assignedTo?.some(
        (u) => u._id === currentUser?._id
    );

    // Filter status options based on user role and current status
    const getAvailableStatusOptions = () => {
        if (isAdmin) {
            // Admin can set Pending, In Progress, or Finalize & Complete (Override)
            // We exclude Awaiting Verification because that is set automatically by the checklist
            return STATUS_DATA.filter(
                (s) => s.value !== "Awaiting Verification"
            ).map((s) => {
                if (s.value === "Completed") {
                    return { ...s, label: "Finalize & Complete (Override)" };
                }
                return s;
            });
        } else if (isAssigned) {
            // Regular user can only set Pending, In Progress, or Awaiting Verification
            return STATUS_DATA.filter((s) => s.value !== "Completed");
        }
        return [];
    };

    return (
        <DashboardLayout activeMenu={activeMenu}>
            <div className="mt-5 px-4 sm:px-6 lg:px-8">
                {task && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                        {/* Main Content (Task Info + Comments) */}
                        <div className="md:col-span-3 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all hover:shadow-xl">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {task?.title}
                                        </h2>
                                        {currentUser?.role === "admin" && (
                                            <button
                                                onClick={handleEditClick}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm font-medium"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Task
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Current Status Tag */}
                                        <div
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusTagColor(
                                                task?.status
                                            )}`}
                                        >
                                            {task?.status}
                                            <span className="ml-1.5 w-2 h-2 rounded-full bg-current opacity-80"></span>
                                        </div>

                                        {/* Quick Status Update Dropdown */}
                                        {(isAdmin || isAssigned) && (
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setIsStatusDropdownOpen(
                                                            !isStatusDropdownOpen
                                                        )
                                                    }
                                                    disabled={isUpdatingStatus}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                                                        isUpdatingStatus
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                                    }`}
                                                >
                                                    {isUpdatingStatus ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                    Update Status
                                                </button>

                                                <AnimatePresence>
                                                    {isStatusDropdownOpen && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                y: 10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: 10,
                                                            }}
                                                            className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 origin-top-left"
                                                        >
                                                            <div className="p-2">
                                                                {getAvailableStatusOptions().map(
                                                                    (
                                                                        statusOption
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                statusOption.value
                                                                            }
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    statusOption.value
                                                                                )
                                                                            }
                                                                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition flex items-center gap-2 ${
                                                                                task?.status ===
                                                                                statusOption.value
                                                                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                                                                    : "text-gray-700 hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            {statusOption.value ===
                                                                                "Completed" && (
                                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                                            )}
                                                                            {statusOption.value ===
                                                                                "In Progress" && (
                                                                                <Loader className="w-4 h-4 text-blue-600" />
                                                                            )}
                                                                            {statusOption.value ===
                                                                                "Pending" && (
                                                                                <Clock className="w-4 h-4 text-yellow-600" />
                                                                            )}
                                                                            {statusOption.value ===
                                                                                "Awaiting Verification" && (
                                                                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                                            )}
                                                                            {
                                                                                statusOption.label
                                                                            }
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InfoBox
                                        label="Description"
                                        value={task?.description}
                                    />
                                </div>

                                <div className="grid grid-cols-12 gap-4 mt-4">
                                    <div className="col-span-6 md:col-span-4">
                                        <InfoBox
                                            label={"Priority"}
                                            value={task?.priority}
                                        />
                                    </div>

                                    <div className="col-span-6 md:col-span-4">
                                        <InfoBox
                                            label={"Due Date"}
                                            value={
                                                task?.dueDate
                                                    ? moment(
                                                          task?.dueDate
                                                      ).format("Do MMM YYYY")
                                                    : "N/A"
                                            }
                                        />
                                    </div>

                                    <div className="col-span-6 md:col-span-4">
                                        <label className="text-xs font-medium text-gray-500">
                                            Assigned To
                                        </label>

                                        <AvatarGroup
                                            avatars={
                                                task?.assignedTo?.map(
                                                    (item) =>
                                                        item?.profileImageUrl
                                                ) || []
                                            }
                                            maxVisible={5}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Todo Checklist
                                    </label>

                                    {task?.todoChecklist?.map((item) => (
                                        <TodoChecklistItem
                                            key={item._id}
                                            task={task}
                                            todoItem={item}
                                            setTask={setTask}
                                            isAdmin={isAdmin}
                                            isAssigned={isAssigned}
                                        />
                                    ))}
                                </div>

                                {task?.attachments?.length > 0 && (
                                    <div className="mt-6">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Attachments
                                        </label>

                                        {task?.attachments?.map(
                                            (link, index) => (
                                                <Attachment
                                                    key={`link_${index}`}
                                                    link={link}
                                                    index={index}
                                                    onClick={() =>
                                                        handleLinkClick(link)
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comment Section */}
                            <CommentSection
                                taskId={id}
                                comments={task?.comments}
                                setTask={setTask}
                            />
                        </div>

                        {/* Sidebar Content (Activity Log) */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                    Activity Log
                                </h3>
                                <TaskActivityLog
                                    activityLog={task?.activityLog}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TaskDetails;

const InfoBox = ({ label, value }) => {
    return (
        <>
            <label className="text-xs font-medium text-gray-500">{label}</label>

            <p className="text-[13px] md:text-sm font-medium text-gray-800 mt-0.5">
                {value}
            </p>
        </>
    );
};

const Attachment = ({ link, index, onClick }) => {
    return (
        <div
            className="flex justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:bg-gray-100 transition"
            onClick={onClick}
        >
            <div className="flex flex-1 items-center gap-3">
                <span className="text-xs text-gray-500 font-semibold mr-2">
                    {index < 9 ? `0${index + 1}` : index + 1}
                </span>

                <p className="text-xs text-gray-800 truncate">{link}</p>
            </div>

            <FaExternalLinkAlt className="text-gray-500" />
        </div>
    );
};
