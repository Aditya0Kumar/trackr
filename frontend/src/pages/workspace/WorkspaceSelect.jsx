
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axioInstance";
import { setWorkspaces, setCurrentWorkspace } from "../../redux/slice/workspaceSlice";
import DashboardLayout from "../../components/DashboardLayout";
import { motion } from "framer-motion";
import { Plus, LogIn, Briefcase, ArrowRight } from "lucide-react";

const WorkspaceSelect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { workspaces, loading } = useSelector((state) => state.workspace);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                // If workspaces are already loaded, we might not need to fetch, 
                // but fetching ensures freshness.
                const res = await axiosInstance.get("/workspaces/my-workspaces");
                // The API returns WorkspaceMember objects populate with workspace
                // member struct: { _id, role, workspace: { ... }, user: ... }
                // We want to store helpful structure. 
                // Let's store: [ { ...workspace, role: "Admin" } ]
                
                const formattedWorkspaces = res.data.map(member => ({
                    ...member.workspace,
                    role: member.role,
                    joinedAt: member.joinedAt
                }));

                dispatch(setWorkspaces(formattedWorkspaces));

                // If 0 workspaces, stay here (or redirect to create? User can choose)
                // If 1 workspace? Maybe auto-select? 
                // User might want to create another even if they have 1.
                // Let's NOT auto-select if they deliberately navigated here.
                // But on login, we will redirect here.
                
            } catch (error) {
                console.error("Failed to fetch workspaces", error);
            }
        };

        fetchWorkspaces();
    }, [dispatch]);

    const handleSelectWorkspace = (workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        navigate("/user/dashboard"); 
    };

    return (
        <DashboardLayout activeMenu="Workspaces">
            <div className="w-full max-w-6xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-gray-900">Select a Workspace</h1>
                    <p className="text-gray-500 mt-2">Welcome back, {currentUser?.name}. Choose where you want to work.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/workspace/create")}
                        className="bg-white p-6 rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                            <Plus className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-blue-700">Create Workspace</span>
                    </motion.div>

                    {/* Join Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/workspace/join")}
                        className="bg-white p-6 rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 cursor-pointer flex flex-col items-center justify-center min-h-[200px] transition group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                            <LogIn className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-green-700">Join Workspace</span>
                    </motion.div>

                    {/* Existing Workspaces */}
                    {workspaces.map((ws) => (
                        <motion.div
                            key={ws._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectWorkspace(ws)}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[200px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Briefcase size={100} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 break-words">{ws.name}</h3>
                                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mt-2">
                                    Role: {ws.role}
                                </div>
                            </div>
                            
                            <div className="flex items-center text-blue-600 font-medium text-sm mt-6 group">
                                Open Workspace <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkspaceSelect;

