
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axioInstance";
import { setCurrentWorkspace, addWorkspace } from "../../redux/slice/workspaceSlice";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import { motion } from "framer-motion";

const JoinWorkspace = () => {
    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setLoading(true);
        try {
            const res = await axiosInstance.post("/workspaces/join", { inviteCode });
            const { workspace, member } = res.data;

            dispatch(addWorkspace(workspace));
            dispatch(setCurrentWorkspace({ ...workspace, role: member.role }));
            
            toast.success("Joined workspace successfully!");
            navigate("/user/dashboard");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to join workspace");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Workspaces">
            <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto my-12"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join a Workspace</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono tracking-wider uppercase"
                            placeholder="e.g. A1B2"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Joining..." : "Join Workspace"}
                    </button>

                    <div className="text-center mt-4">
                        <button 
                            type="button"
                            onClick={() => navigate("/workspace/select")}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </DashboardLayout>
    );
};

export default JoinWorkspace;
