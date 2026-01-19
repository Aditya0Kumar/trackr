import Rectification from "../models/rectification.model.js";
import moment from "moment";

// Define the maximum allowed rectifications per month
const MAX_RECTIFICATIONS = 3;

/**
 * Gets the current rectification count and max attempts.
 * @param {string} userId - ID of the admin user.
 * @returns {Promise<{usedCount: number, maxAttempts: number}>}
 */
const getRectificationStats = async (userId, req) => {
    const now = moment();
    const month = now.month();
    const year = now.year();

    const rectificationRecord = await Rectification.findOne({ user: userId, month, year, workspace: req.workspace._id });

    const usedCount = rectificationRecord ? rectificationRecord.count : 0;
    return { usedCount, maxAttempts: MAX_RECTIFICATIONS };
};


/**
 * Increments the rectification count by a specified amount.
 * NOTE: This should only be called after checking the limit.
 * @param {string} userId - ID of the admin performing the rectification.
 * @param {number} incrementAmount - Amount to increment by.
 */
export const incrementRectificationCount = async (userId, incrementAmount, req) => {
    const now = moment();
    const month = now.month();
    const year = now.year();

    await Rectification.findOneAndUpdate(
        { user: userId, month, year, workspace: req.workspace._id },
        { $inc: { count: incrementAmount } },
        { upsert: true }
    );
};


/**
 * Gets the remaining rectification attempts for the current month.
 * @param {string} userId - ID of the admin user.
 * @returns {Promise<number>} Remaining attempts.
 */
export const getRemainingRectifications = async (userId, req) => {
    const { usedCount, maxAttempts } = await getRectificationStats(userId, req);
    return Math.max(0, maxAttempts - usedCount);
};

export const getRectificationAttempts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { usedCount, maxAttempts } = await getRectificationStats(userId, req);
        const remaining = Math.max(0, maxAttempts - usedCount);
        
        res.status(200).json({ remainingAttempts: remaining, maxAttempts: maxAttempts });
    } catch (error) {
        next(error);
    }
};