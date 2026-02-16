import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Send, Paperclip, MoreVertical, Loader } from "lucide-react";
import axiosInstance from "../../utils/axioInstance";
import { useSocket } from "../../context/SocketContext";
import UserAvatar from "../UserAvatar";

const ChatWindow = ({ conversation, isPersonal = true, currentWorkspace }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [typingUser, setTypingUser] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch messages
    const fetchMessages = async () => {
        if (!conversation?._id) return;
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                `/chat/messages/${conversation._id}`
            );
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
        } catch (err) {
            console.error("Error fetching messages:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [conversation?._id]);

    // Socket Listener
    // Socket Listener
    useEffect(() => {
        if (!socket || !conversation?._id) return;

        // Join specific room based on chat type
        if (conversation.workspaceId && conversation.groupId) {
             socket.emit("join_group", conversation.groupId);
        } else {
             socket.emit("join_chat", conversation._id);
        }

        const handleNewMessage = (msg) => {
            if (msg.conversationId === conversation._id) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();
            }
        };

        const handleTyping = ({ userId, isTyping, conversationId }) => {
            if (conversationId === conversation._id && userId !== currentUser._id) {
                 setTypingUser(isTyping ? userId : null);
            }
        };

        socket.on("new_message", handleNewMessage);
        socket.on("typing", handleTyping);

        return () => {
            if (conversation.workspaceId && conversation.groupId) {
                socket.emit("leave_group", conversation.groupId);
            } else {
                socket.emit("leave_chat", conversation._id);
            }
            socket.off("new_message", handleNewMessage);
            socket.off("typing", handleTyping);
        };
    }, [socket, conversation?._id, conversation?.groupId]);

    const typingTimeoutRef = useRef(null);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !conversation?._id) return;

        // Emit typing started
        socket.emit("typing", { conversationId: conversation._id, isTyping: true });

        // Clear existing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing", { conversationId: conversation._id, isTyping: false });
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Stop typing immediately on send
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit("typing", { conversationId: conversation._id, isTyping: false });

        try {
            // Optimistic update could be added here
            const text = newMessage;
            setNewMessage(""); 

            await axiosInstance.post(
                `/chat/messages/${conversation._id}`,
                { text }
            );
            // new_message event will fetch the real message
        } catch (err) {
             console.error("Failed to send message", err);
        }
    };

    // Determine chat title and avatar
    const getChatHeaderInfo = () => {
        if (!isPersonal) {
            return {
                name: "Team Chat",
                image: null, // Could use workspace logo
                subtext: `${currentWorkspace?.name} - General`,
            };
        }

        // Personal Chat: Other user
        const otherMember = conversation?.members?.find(
            (m) => m._id !== currentUser?._id
        );
        return {
            name: otherMember?.name || "Unknown User",
            image: otherMember?.profileImageUrl,
            subtext: otherMember?.email,
        };
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
                Select a conversation to start chatting
            </div>
        );
    }

    const { name, image, subtext } = getChatHeaderInfo();

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {image ? (
                        <UserAvatar imageUrl={image} size="w-10 h-10" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            #
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        <p className="text-xs text-gray-500">{subtext}</p>
                    </div>
                </div>
                {/* Actions (Future: search, info) */}
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
                {loading && <div className="text-center text-xs text-gray-500">Loading messages...</div>}
                
                {messages.map((msg, index) => {
                    const isMe = msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
                    return (
                        <div
                            key={msg._id || index}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            {!isMe && (
                                <UserAvatar
                                    imageUrl={msg.sender?.profileImageUrl}
                                    size="w-8 h-8 mr-2 mt-1"
                                />
                            )}
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                    isMe
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                }`}
                            >
                                {!isMe && isPersonal === false && (
                                     <p className="text-[10px] opacity-70 mb-1 font-semibold">{msg.sender?.name}</p>
                                )}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <p
                                    className={`text-[10px] mt-1 text-right ${
                                        isMe ? "text-indigo-200" : "text-gray-400"
                                    }`}
                                >
                                    {moment(msg.createdAt).format("LT")}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUser && (
                 <div className="px-6 py-2 text-xs text-gray-500 italic bg-gray-50">
                    {isPersonal ? "Typing..." : "Someone is typing..."}
                 </div>
            )}

            {/* Input */}
            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white flex items-center gap-3"
            >
                {/* Future attachment button */}
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                    <Paperclip size={20} />
                </button>

                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition focus:outline-none"
                />

                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-2.5 rounded-full text-white transition shadow-md ${
                        !newMessage.trim()
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                    }`}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
