
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Trash2, RefreshCw, Copy, Save, Users, Shield } from "lucide-react";
import { setWorkspaces, setCurrentWorkspace } from "../../redux/slice/workspaceSlice";
import UserAvatar from "../../components/UserAvatar";

const WorkspaceSettings = () => {
    const { currentWorkspace, workspaces } = useSelector((state) => state.workspace);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [newName, setNewName] = useState(currentWorkspace?.name || "");
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const isOwner = currentWorkspace?.owner === currentUser?._id;
    const userRole = currentWorkspace?.role; 
    const isOwnerOrAdmin = ["Owner", "Admin"].includes(userRole);

    const fetchMembers = async () => {
        try {
            setLoadingMembers(true);
            const res = await axiosInstance.get(`/workspaces/${currentWorkspace._id}/members`);
            setMembers(res.data);
        } catch (error) {
            console.error("Error fetching members:", error);
            // toast.error("Failed to load members");
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (currentWorkspace) {
            fetchMembers();
        }
    }, [currentWorkspace]);


    if (!currentWorkspace) return null;

    const handleDeleteWorkspace = async () => {
        if (!window.confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) return;
        
        setLoading(true);
        try {
            await axiosInstance.delete(`/workspaces/${currentWorkspace._id}`);
            toast.success("Workspace deleted successfully");
            
            // Remove from store
            const updatedWorkspaces = workspaces.filter(ws => ws._id !== currentWorkspace._id);
            dispatch(setWorkspaces(updatedWorkspaces));
            dispatch(setCurrentWorkspace(null));
            
            navigate("/workspace/select");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete workspace");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(currentWorkspace.inviteCode);
        toast.success("Invite code copied!");
    };

    const handleRegenerateCode = async () => {
        try {
            const res = await axiosInstance.post(`/workspaces/${currentWorkspace._id}/regenerate-invite`);
            dispatch(setCurrentWorkspace({ ...currentWorkspace, inviteCode: res.data.inviteCode }));
            toast.success("Invite code regenerated");
        } catch (error) {
            toast.error("Failed to regenerate code");
        }
    };

    const handleRoleChange = async (memberId, newRole) => {
        try {
            await axiosInstance.patch(`/workspaces/members/${memberId}/role`, { role: newRole });
            toast.success("Role updated successfully");
            fetchMembers(); // Refresh list to reflect changes
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };
    
    const handleRemoveMember = async (memberId) => {
        if(!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            await axiosInstance.delete(`/workspaces/members/${memberId}`);
            toast.success("Member removed successfully");
            setMembers(prev => prev.filter(m => m._id !== memberId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove member");
        }
    }


    const handleLeaveWorkspace = async () => {
        if (!window.confirm("Are you sure you want to leave this workspace?")) return;
        try {
            await axiosInstance.delete(`/workspaces/members/${currentUser._id}`); // Self-removal
            const membership = members.find(m => m.user._id === currentUser._id);
            if (membership) {
                 await axiosInstance.delete(`/workspaces/members/${membership._id}`);
                 toast.success("Left workspace successfully");
                 dispatch(setCurrentWorkspace(null));
                 navigate("/workspace/select");
            }
        } catch (error) {
             toast.error("Failed to leave workspace");
        }
    };

    return (
        <DashboardLayout activeMenu="Settings">
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workspace Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your workspace preferences, members, and permissions.</p>
                </div>

                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Save size={20} className="text-indigo-600"/> General Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                            <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                disabled={!isOwnerOrAdmin}
                                className={`w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 ${!isOwnerOrAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        {isOwnerOrAdmin && newName !== currentWorkspace.name && (
                             <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        )}
                       
                    </div>
                </div>

                {/* Invite Code */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-indigo-600"/> Invite Members
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Share this code to invite new members to <strong>{currentWorkspace.name}</strong>.</p>
                    
                    <div className="flex items-center gap-3 max-w-md">
                        <div className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-lg tracking-widest text-gray-800 text-center border border-gray-200 select-all">
                            {currentWorkspace.inviteCode}
                        </div>
                        <button 
                            onClick={handleCopyCode}
                            className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                            title="Copy Code"
                        >
                            <Copy size={20} />
                        </button>
                        {isOwnerOrAdmin && (
                            <button 
                                onClick={handleRegenerateCode}
                                className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                                title="Regenerate Code"
                            >
                                <RefreshCw size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Members List - Visible to Everyone (Read Only for Members) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <Shield size={20} className="text-indigo-600"/> Team Members & Roles
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-2 font-medium text-gray-500 text-sm">Member</th>
                                    <th className="py-3 px-2 font-medium text-gray-500 text-sm">Role</th>
                                    {isOwnerOrAdmin && <th className="py-3 px-2 font-medium text-gray-500 text-sm text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => {
                                    const isMe = member.user._id === currentUser._id;
                                    const isMemberOwner = currentWorkspace.owner === member.user._id;
                                    
                                    // Edit Permission Logic
                                    let canEdit = false;
                                    if (isOwner) {
                                        canEdit = !isMe; 
                                    } else if (userRole === "Admin") {
                                        canEdit = !isMe && !isMemberOwner && member.role !== "Admin";
                                    }

                                    return (
                                        <tr key={member._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar imageUrl={member.user.profileImageUrl} size="w-8 h-8" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{member.user.name}</p>
                                                        <p className="text-xs text-gray-500">{member.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                {canEdit ? (
                                                    <select
                                                        value={member.role} 
                                                        onChange={(e) => handleRoleChange(member._id, e.target.value)}
                                                        className="block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Manager">Manager</option>
                                                        <option value="Member">Member</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                                                          member.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                                                          'bg-gray-100 text-gray-800'}`}>
                                                        {member.role}
                                                    </span>
                                                )}
                                            </td>
                                            {isOwnerOrAdmin && (
                                                <td className="py-3 px-2 text-right">
                                                    {canEdit && (
                                                       <button 
                                                            onClick={() => handleRemoveMember(member._id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                                                            title="Remove Member"
                                                       >
                                                            <Trash2 size={16}/>
                                                       </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {loadingMembers && <div className="text-center py-4 text-gray-500 text-sm">Loading members...</div>}
                    </div>
                </div>

                {/* Leave Workspace - For Non-Owners */}
                {!isOwner && (
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                         <h2 className="text-xl font-semibold mb-2 text-orange-800">Leave Workspace</h2>
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-700">Revoke your access to this workspace. You will need a new invite to rejoin.</p>
                            </div>
                            <button 
                                onClick={handleLeaveWorkspace}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition shadow-sm"
                            >
                                Leave Workspace
                            </button>
                        </div>
                    </div>
                )}

                {/* Danger Zone - Only for Owner */}
                {isOwner && (
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                        <h2 className="text-xl font-semibold mb-2 text-red-800">Danger Zone</h2>
                        <p className="text-sm text-red-600 mb-6">Irreversible actions. Proceed with caution.</p>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Delete Workspace</h3>
                                <p className="text-xs text-gray-500 mt-1">Permanently remove this workspace and all its data.</p>
                            </div>
                            <button 
                                onClick={handleDeleteWorkspace}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                            >
                                <Trash2 size={18} /> Delete Workspace
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WorkspaceSettings;
