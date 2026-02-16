import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";
import ChannelList from "../../components/chat/ChannelList";
import CreateChannelModal from "../../components/chat/CreateChannelModal";
import axiosInstance from "../../utils/axioInstance";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceChat = () => {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    
    // State
    const [conversation, setConversation] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // URL Params
    const searchParams = new URLSearchParams(window.location.search);
    const groupId = searchParams.get("groupId");

    // Check permissions
    const canAddChannel = ["Admin", "Manager", "Owner"].includes(currentWorkspace?.role);

    // Fetch Groups
    useEffect(() => {
        if (!currentWorkspace) return;
        fetchGroups();
    }, [currentWorkspace]);

    const fetchGroups = async () => {
        try {
            setGroupsLoading(true);
            const res = await axiosInstance.get("/workspace-groups");
            setGroups(res.data);
        } catch (err) {
            console.error("Error fetching groups:", err);
        } finally {
            setGroupsLoading(false);
        }
    };

    // Auto-select group logic
    // We prefer the URL groupId if valid, otherwise fallback to the first group (General)
    const activeGroupId = groupId || (groups.length > 0 ? groups[0]._id : null);

    // Fetch Chat Handling
    useEffect(() => {
        if (!currentWorkspace) return;

        // If we have groups but no active selection in URL, auto-navigate to the fallback
        if (!groupId && activeGroupId) {
             navigate(`?groupId=${activeGroupId}`, { replace: true });
             return; 
        }

        if(!activeGroupId) return;

        const fetchConversation = async () => {
            try {
                setChatLoading(true);
                const res = await axiosInstance.get(`/chat/workspace/group/${activeGroupId}`);
                setConversation(res.data);
            } catch (err) {
                console.error("Error fetching conversation:", err);
            } finally {
                setChatLoading(false);
            }
        };

        fetchConversation();
    }, [currentWorkspace, activeGroupId, groupId, navigate]);

    // Handlers
    const handleChannelSelect = (id) => {
        navigate(`?groupId=${id}`);
    };

    const handleChannelCreated = (newGroup) => {
        fetchGroups().then(() => {
            navigate(`?groupId=${newGroup._id}`);
        });
        setIsCreateModalOpen(false);
    };

    return (
        <DashboardLayout activeMenu="Messages">
            <div className="h-[calc(100vh-100px)] mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex">
                {/* Left Panel: Channel List */}
                {groupsLoading ? (
                    <div className="w-64 border-r border-gray-200 flex items-center justify-center">
                        <Loader className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <ChannelList 
                        groups={groups} 
                        selectedGroupId={activeGroupId} 
                        onSelect={handleChannelSelect}
                        onAddChannel={() => setIsCreateModalOpen(true)}
                        canAddChannel={canAddChannel}
                    />
                )}

                {/* Right Panel: Chat Window */}
                <div className="flex-1 flex flex-col min-w-0">
                    {chatLoading ? (
                         <div className="flex-1 flex items-center justify-center">
                            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                        </div>
                    ) : conversation ? (
                        <ChatWindow 
                            conversation={conversation} 
                            isPersonal={false} 
                            currentWorkspace={currentWorkspace}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a channel to start chatting
                        </div>
                    )}
                </div>
            </div>

            {/* Create Channel Modal */}
            <CreateChannelModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleChannelCreated}
            />
        </DashboardLayout>
    );
};

export default WorkspaceChat;
