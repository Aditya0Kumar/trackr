
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axioInstance";
import { setCurrentWorkspace, addWorkspace } from "../../redux/slice/workspaceSlice";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import { motion } from "framer-motion";

const CreateWorkspace = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await axiosInstance.post("/workspaces", { name });
            const { workspace, member } = res.data;

            dispatch(addWorkspace(workspace));
            // Automatically select the new workspace
            dispatch(setCurrentWorkspace({ ...workspace, role: member.role }));
            
            toast.success("Workspace created successfully!");
            navigate("/user/dashboard");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create workspace");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Workspaces">
            <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto my-12" // Added my-12 for spacing in dashboard
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create a Workspace</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g. Acme Corp"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Workspace"}
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

export default CreateWorkspace;
