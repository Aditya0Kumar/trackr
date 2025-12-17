import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axioInstance";
import { useSelector } from "react-redux";

const useNotifications = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const response = await axiosInstance.get("/notifications");
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    const markAsRead = async (notificationId) => {
        try {
            await axiosInstance.put("/notifications/read", { notificationId });
            
            if (notificationId === "all") {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            } else {
                setNotifications(prev => 
                    prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Set up polling (e.g., every 30 seconds)
        const intervalId = setInterval(fetchNotifications, 30000);

        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    return { notifications, unreadCount, loading, fetchNotifications, markAsRead };
};

export default useNotifications;