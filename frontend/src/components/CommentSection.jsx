import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommentCard from "./CommentCard";
import axiosInstance from "../utils/axioInstance";
import toast from "react-hot-toast";

const CommentSection = ({ taskId, comments, setTask }) => {
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post(
                `/comments/task/${taskId}`,
                { text: newComment }
            );

            if (response.data?.task) {
                setTask(response.data.task);
                setNewComment("");
                toast.success("Comment added!");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Activity & Comments ({comments?.length || 0})
            </h3>

            {/* Comment Input Form */}
            <motion.form
                onSubmit={handleAddComment}
                className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment or update..."
                    rows={2}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    disabled={loading}
                />
                <motion.button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`self-end p-3 rounded-xl transition-all duration-200 ${
                        loading || !newComment.trim()
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    }`}
                >
                    <Send className="w-5 h-5" />
                </motion.button>
            </motion.form>

            {/* Comments List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {comments && comments.length > 0 ? (
                        [...comments].reverse().map((comment) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CommentCard comment={comment} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
                            No activity yet. Be the first to comment!
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommentSection;