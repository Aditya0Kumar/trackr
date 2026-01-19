import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { io } from "../socket/socket.js";

/**
 * Creates and saves a notification for a list of recipients.
 * @param {Array<string>} recipientIds - Array of user IDs to notify.
 * @param {string} senderId - ID of the user who triggered the event.
 * @param {string} type - Type of notification (e.g., 'task_assigned').
 * @param {string} message - The notification message.
 * @param {string} link - The link to the related resource (e.g., task ID).
 */
export const createNotifications = async (
    recipientIds,
    senderId,
    type,
    message,
    link
) => {
    try {
        // Filter out the sender from the recipients list to avoid self-notification
        const finalRecipients = recipientIds.filter(
            (id) => id.toString() !== senderId.toString()
        );

        if (finalRecipients.length === 0) return;

        const notifications = finalRecipients.map((recipientId) => ({
            recipient: recipientId,
            sender: senderId,
            type,
            message,
            link,
            isRead: false,
        }));

        const savedNotifications = await Notification.insertMany(notifications);

        // Emit real-time notification to each recipient
        savedNotifications.forEach((notification) => {
            io.to(notification.recipient.toString()).emit("new_notification", notification);
        });

    } catch (error) {
        console.error("Error creating notifications:", error);
    }
};