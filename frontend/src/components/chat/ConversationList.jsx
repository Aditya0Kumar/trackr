import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";
import moment from "moment";
import { Search, Plus } from "lucide-react";

const ConversationList = ({ conversations = [], loading, onSelect, selectedId, onNewChat }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(c => {
         const other = c.members.find(m => m._id !== currentUser._id);
         return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full border-r border-gray-200 bg-white w-full md:w-80">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Chats</h2>
                <button 
                    onClick={onNewChat}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition"
                    title="Start new chat"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        {conversations.length === 0 
                            ? "No conversations yet." 
                            : "No results found."}
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const otherMember = conv.members.find(m => m._id !== currentUser._id);
                        const isSelected = conv._id === selectedId;
                        const unreadCount = conv.unreadCounts?.[currentUser._id] || 0;

                        return (
                            <div 
                                key={conv._id}
                                onClick={() => onSelect(conv)}
                                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 ${
                                    isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-600" : "border-l-4 border-l-transparent"
                                }`}
                            >
                                <UserAvatar imageUrl={otherMember?.profileImageUrl} size="w-12 h-12" />
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm font-semibold truncate ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                                            {otherMember?.name || "Unknown"}
                                        </h4>
                                        {conv.lastMessage && (
                                            <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                                {moment(conv.lastMessage.createdAt).fromNow()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 truncate mr-2">
                                            {conv.lastMessage?.sender === currentUser._id && "You: "}
                                            {conv.lastMessage?.text || "No messages yet"}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
