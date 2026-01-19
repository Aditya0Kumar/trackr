import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import moment from "moment";
import { getRemainingRectifications, incrementRectificationCount } from "./rectification.controller.js";

// Helper to normalize date to start of day for unique indexing
const normalizeDate = (date) => {
    return moment(date).startOf('day').toDate();
};

// Admin endpoint to mark attendance for multiple users on a specific date
export const markAttendance = async (req, res, next) => {
    try {
        const { date, attendanceRecords } = req.body; // attendanceRecords: [{ userId, status }]
        const markedBy = req.user.id;

        if (!date || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return next(errorHandler(400, "Date and attendance records are required."));
        }

        const normalizedDate = normalizeDate(date);
        const targetDate = moment(normalizedDate);
        const today = moment().startOf('day');
        
        const isPastDate = targetDate.isBefore(today);
        
        let rectificationsNeeded = 0;
        const bulkOperations = [];
        
        // 1. Pre-check: Determine how many rectifications are needed
        for (const record of attendanceRecords) {
            const { userId, status } = record;

            if (!["Present", "Absent", "Leave"].includes(status)) {
                return next(errorHandler(400, `Invalid status for user ${userId}`));
            }

            const existingRecord = await Attendance.findOne({ user: userId, date: normalizedDate, workspace: req.workspace._id });
            
            // A rectification is needed if:
            // 1. It's a past date AND
            // 2. The status is different from the existing record OR no record exists (i.e., status is not 'Absent' by default)
            
            const isStatusChange = existingRecord && existingRecord.status !== status;
            const isNewEntry = !existingRecord && status !== 'Absent'; // Assuming default is Absent if no record exists

            if (isPastDate && (isStatusChange || isNewEntry)) {
                rectificationsNeeded++;
            }

            bulkOperations.push({
                updateOne: {
                    filter: { user: userId, date: normalizedDate, workspace: req.workspace._id },
                    update: {
                        $set: {
                            status: status,
                            markedBy: markedBy,
                            workspace: req.workspace._id,
                        }
                    },
                    upsert: true,
                }
            });
        }

        // 2. Check Rectification Limit
        if (rectificationsNeeded > 0) {
            const remaining = await getRemainingRectifications(markedBy, req);
            
            if (rectificationsNeeded > remaining) {
                return next(errorHandler(403, `Rectification limit exceeded. You have ${remaining} attempts remaining this month.`));
            }
            
            // 3. Increment count before performing bulk write
            await incrementRectificationCount(markedBy, rectificationsNeeded, req);
        }

        // 4. Perform Bulk Write
        const result = await Attendance.bulkWrite(bulkOperations);

        res.status(200).json({
            message: "Attendance marked successfully.",
            result,
        });

    } catch (error) {
        next(error);
    }
};

// Get attendance records for a specific user or all users (admin)
export const getAttendanceRecords = async (req, res, next) => {
    try {
        const { userId, startDate, endDate } = req.query;
        const requesterId = req.user.id;
        const requesterWorkspaceRole = req.workspaceMember.role;

        let filter = { workspace: req.workspace._id }; // Start with workspace filter

        if (requesterWorkspaceRole === 'Member') {
            // Users can only see their own records
            filter.user = requesterId;
        } else if (userId) {
            // Admin can filter by specific user
            filter.user = userId;
        }
        // If admin and no userId, they see all records (potentially too many, but let's rely on date range)

        if (startDate && endDate) {
            filter.date = {
                $gte: normalizeDate(startDate),
                $lte: normalizeDate(endDate),
            };
        } else if (requesterWorkspaceRole === 'Member') {
             // Default to last 30 days for users if no range specified
             const defaultEndDate = normalizeDate(new Date());
             const defaultStartDate = moment(defaultEndDate).subtract(30, 'days').toDate();
             filter.date = { $gte: defaultStartDate, $lte: defaultEndDate };
        }


        const records = await Attendance.find(filter)
            .sort({ date: -1 })
            .populate("user", "name profileImageUrl")
            .populate("markedBy", "name");

        res.status(200).json(records);

    } catch (error) {
        next(error);
    }
};