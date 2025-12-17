import React, { useState } from "react";
import { CheckCircle, XCircle, User } from "lucide-react";
import UserAvatar from "../UserAvatar";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const TodoChecklistItem = ({ task, todoItem, setTask, isAdmin, isAssigned }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleCompletion = async () => {
        if (!isAssigned && !isAdmin) return;

        setIsToggling(true);
        
        // Create the updated checklist array for the API call
        const updatedChecklist = task.todoChecklist.map(item => 
            item._id === todoItem._id 
                ? { ...item, completed: !todoItem.completed } 
                : item
        );

        // The backend will handle setting completedBy and verified=false
        try {
            const response = await axiosInstance.put(`/tasks/${task._id}/todo`, {
                todoChecklist: updatedChecklist.map(item => ({
                    text: item.text,
                    completed: item.completed
                })),
            });

            if (response.status === 200) {
                setTask(response.data?.task);
                toast.success(`Item ${todoItem.completed ? 'unchecked' : 'completed'}!`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update checklist.";
            toast.error(errorMessage);
        } finally {
            setIsToggling(false);
        }
    };

    const handleToggleVerification = async (newVerifiedStatus) => {
        if (!isAdmin) return;
        if (!todoItem.completed && newVerifiedStatus) {
            toast.error("Cannot verify an incomplete item.");
            return;
        }

        setIsVerifying(true);
        
        try {
            const response = await axiosInstance.put(`/tasks/${task._id}/todo/verify`, {
                todoId: todoItem._id,
                verified: newVerifiedStatus,
            });

            if (response.status === 200) {
                setTask(response.data?.task);
                toast.success(`Item ${newVerifiedStatus ? 'verified' : 'unverified'}!`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update verification status.";
            toast.error(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    const canToggleCompletion = isAssigned || isAdmin;
    const canVerify = isAdmin && todoItem.completed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 border transition-all duration-300 
                ${todoItem.verified ? 'bg-green-50 border-green-300' : todoItem.completed ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}
            `}
        >
            {/* Completion Checkbox (User/Admin) */}
            <input
                type="checkbox"
                checked={todoItem.completed}
                onChange={handleToggleCompletion}
                disabled={isToggling || !canToggleCompletion}
                className="w-4 h-4 text-indigo-600 bg-white border border-gray-300 rounded outline-none cursor-pointer accent-indigo-600 flex-shrink-0"
            />

            {/* Text */}
            <p className={`flex-1 text-sm text-gray-800 ${todoItem.completed ? 'line-through text-gray-500' : ''}`}>
                {todoItem.text}
            </p>

            {/* Status/Contributor Info */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {todoItem.completed && todoItem.completedBy && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                        <UserAvatar 
                            imageUrl={todoItem.completedBy.profileImageUrl} 
                            size="w-5 h-5" 
                        />
                        <span className="font-medium">{todoItem.completedBy.name}</span>
                    </div>
                )}

                {/* Verification Status (Visible to all, Actionable by Admin) */}
                {todoItem.completed && (
                    <div className="flex items-center">
                        {todoItem.verified ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                                <XCircle className="w-3 h-3" /> Pending
                            </span>
                        )}
                        
                        {/* Admin Verification Button */}
                        {canVerify && (
                            <button
                                type="button"
                                onClick={() => handleToggleVerification(!todoItem.verified)}
                                disabled={isVerifying}
                                className={`ml-2 p-1 rounded-full transition ${
                                    todoItem.verified 
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                {isVerifying ? (
                                    <User className="w-4 h-4 animate-spin" />
                                ) : todoItem.verified ? (
                                    <XCircle className="w-4 h-4" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TodoChecklistItem;