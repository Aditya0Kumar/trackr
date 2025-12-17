import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import { Calendar, Save, AlertTriangle } from "lucide-react";
import AttendanceFormRow from "../../components/attendance/AttendanceFormRow";
import moment from "moment";

const ManageAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [users, setUsers] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState({}); // { userId: status }
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rectificationStats, setRectificationStats] = useState({ remainingAttempts: 0, maxAttempts: 3 });

    // Helper to check if the selected date is in the past (excluding today)
    const isPastDate = moment(selectedDate).startOf('day').isBefore(moment().startOf('day'));

    // 1. Fetch all non-admin users
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("/users/get-users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load team members.");
        }
    };

    // 2. Fetch existing attendance for the selected date
    const fetchAttendanceForDate = useCallback(async () => {
        if (!users.length) return;

        setLoading(true);
        const dateString = moment(selectedDate).format("YYYY-MM-DD");
        
        try {
            // Fetch records for the selected date
            const response = await axiosInstance.get("/attendance", {
                params: {
                    startDate: dateString,
                    endDate: dateString,
                },
            });

            const records = response.data;
            const newStatus = {};

            // Initialize status map: default to Absent, then override with fetched records
            users.forEach(user => {
                newStatus[user._id] = 'Absent';
            });

            records.forEach(record => {
                newStatus[record.user._id] = record.status;
            });

            setAttendanceStatus(newStatus);

        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to load attendance records.");
            // If error, initialize all to Absent
            const initialStatus = {};
            users.forEach(user => { initialStatus[user._id] = 'Absent'; });
            setAttendanceStatus(initialStatus);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, users]);

    // 3. Fetch rectification attempts
    const fetchRectificationAttempts = async () => {
        try {
            const response = await axiosInstance.get("/rectifications/attempts");
            setRectificationStats(response.data);
        } catch (error) {
            console.error("Error fetching rectification attempts:", error);
            // If error, default to max attempts
            setRectificationStats({ remainingAttempts: 0, maxAttempts: 3 });
        }
    };

    // 4. Handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const attendanceRecords = users.map(user => ({
            userId: user._id,
            status: attendanceStatus[user._id] || 'Absent'
        }));

        try {
            await axiosInstance.post("/attendance/mark", {
                date: selectedDate.toISOString(),
                attendanceRecords,
            });

            toast.success(`Attendance for ${moment(selectedDate).format("MMM Do")} saved successfully!`);
            
            // If a past date was marked, refresh rectification attempts
            if (isPastDate) {
                fetchRectificationAttempts();
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save attendance.";
            console.error("Error marking attendance:", error);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRectificationAttempts();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            fetchAttendanceForDate();
        }
    }, [selectedDate, users, fetchAttendanceForDate]);

    const canRectify = rectificationStats.remainingAttempts > 0;
    const isMarkingAllowed = !isPastDate || canRectify;

    return (
        <DashboardLayout activeMenu={"Manage Attendance"}>
            <div className="my-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Manage Team Attendance
                </h2>
                <p className="text-gray-500 mb-6">
                    Mark the daily presence status for all team members.
                </p>

                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                    {/* Date Selector */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                        <label className="text-lg font-semibold text-gray-800">
                            Select Date:
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            maxDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium w-48"
                        />
                    </div>

                    {/* Rectification Warning/Info */}
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-800 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-indigo-600" />
                        <div>
                            <p className="font-semibold">Attendance Rectification Policy:</p>
                            <p>Marking attendance for previous days (rectification) is limited to 
                                <span className="font-bold mx-1">{rectificationStats.maxAttempts} attempts</span> 
                                per month.
                            </p>
                            <p className="mt-1">
                                You have <span className="font-bold">{rectificationStats.remainingAttempts} attempts</span> remaining this month.
                            </p>
                        </div>
                    </div>

                    {/* Past Date Restriction Warning */}
                    {isPastDate && !canRectify && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-sm text-red-800 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                            <p className="font-semibold">
                                Rectification Limit Reached: You cannot mark attendance for previous dates until next month.
                            </p>
                        </div>
                    )}


                    {/* Attendance List */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500">Loading attendance...</div>
                            ) : users.length > 0 ? (
                                users.map(user => (
                                    <AttendanceFormRow
                                        key={user._id}
                                        user={user}
                                        attendanceStatus={attendanceStatus}
                                        setAttendanceStatus={setAttendanceStatus}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">No team members found.</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || loading || users.length === 0 || (isPastDate && !canRectify)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                                    isSubmitting || loading || users.length === 0 || (isPastDate && !canRectify)
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                                }`}
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? "SAVING..." : "SAVE ATTENDANCE"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageAttendance;