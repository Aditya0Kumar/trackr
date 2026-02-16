import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";
import ConversationList from "../../components/chat/ConversationList";
import axiosInstance from "../../utils/axioInstance";
import { MessageSquare, Plus } from "lucide-react";
import Modal from "../../components/Modal";
import UserAvatar from "../../components/UserAvatar";
import toast from "react-hot-toast";

const PersonalChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Search User State (for Modal)
    const [foundUsers, setFoundUsers] = useState([]);
    
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/chat/personal");
            setConversations(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching conversations:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Auto-select most recent conversation
    useEffect(() => {
        if (!loading && conversations.length > 0 && !selectedConversation) {
            setSelectedConversation(conversations[0]);
        }
    }, [loading, conversations, selectedConversation]);

    // Handle New Chat Creation
    const searchUsers = async (query) => {
        if (!query.trim()) return setFoundUsers([]);
        try {
            const res = await axiosInstance.get(`/users/connections?search=${query}`);
            // Backend now handles self-exclusion and duplicates
            setFoundUsers(res.data); 
        } catch (err) {
            console.error(err);
        }
    };

    const startChat = async (receiverId) => {
        try {
            const res = await axiosInstance.post("/chat/personal/start", { receiverId });
            const newConv = res.data;
            
            // Update list
            const exists = conversations.find(c => c._id === newConv._id);
            if (!exists) {
                setConversations([newConv, ...conversations]);
            }
            
            setSelectedConversation(newConv);
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Failed to start chat");
        }
    };

    return (
        <DashboardLayout activeMenu="Messages">
            <div className="flex h-[calc(100vh-100px)] mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Sidebar List */}
                <div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-80 h-full`}>
                    <ConversationList 
                        conversations={conversations}
                        loading={loading}
                        onSelect={setSelectedConversation} 
                        selectedId={selectedConversation?._id}
                        onNewChat={() => setIsModalOpen(true)}
                    />
                </div>

                {/* Main Chat Window */}
                <div className={`${!selectedConversation ? "hidden md:flex" : "flex"} flex-1 flex-col h-full bg-gray-50`}>
                    {selectedConversation ? (
                        <>
                             {/* Mobile Back Button */}
                             <div className="md:hidden p-2 bg-white border-b border-gray-200 flex items-center">
                                 <button onClick={() => setSelectedConversation(null)} className="text-indigo-600 font-medium text-sm flex items-center gap-1">
                                     ← Back
                                 </button>
                             </div>
                             <ChatWindow conversation={selectedConversation} isPersonal={true} />
                        </>
                    ) : (
                        // Empty State / CTA
                        loading ? (
                             <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-500 shadow-sm">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No conversations yet</h3>
                                <p className="max-w-xs text-gray-500 mb-8">
                                    Start a new conversation with a team member to collaborate directly.
                                </p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2"
                                >
                                    <Plus size={20} /> Start New Chat
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Message">
                <div className="h-96 flex flex-col">
                    <div className="mb-4 relative">
                        <input 
                             type="text" 
                             placeholder="Search for a user..."
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                             onChange={(e) => {
                                 searchUsers(e.target.value);
                             }}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                         {foundUsers.map(u => (
                             <div 
                                key={u._id} 
                                onClick={() => startChat(u._id)}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition border-b border-gray-50/50"
                             >
                                 <UserAvatar imageUrl={u.profileImageUrl} size="w-10 h-10" />
                                 <div>
                                     <p className="font-semibold text-gray-800">{u.name}</p>
                                     <p className="text-xs text-gray-500">{u.email}</p>
                                 </div>
                             </div>
                         ))}
                         {foundUsers.length === 0 && (
                             <div className="text-center text-gray-400 mt-12 text-sm">
                                 Type to search for users...
                             </div>
                         )}
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default PersonalChat;
