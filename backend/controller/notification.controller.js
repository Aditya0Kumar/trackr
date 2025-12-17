import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/error.js";

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("sender", "name profileImageUrl");

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            read: false,
        });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.body;
        const userId = req.user.id;

        if (notificationId === "all") {
            await Notification.updateMany(
                { recipient: userId, read: false },
                { $set: { read: true } }
            );
            return res.status(200).json({ message: "All notifications marked as read" });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId, read: false },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return next(errorHandler(404, "Notification not found or already read"));
        }

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        next(error);
    }
};