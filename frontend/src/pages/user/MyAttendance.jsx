import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import moment from "moment";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const MyAttendance = () => {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const { currentUser } = useSelector((state) => state.user);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            // Determine endpoint: Global if no workspace, otherwise standard
            const endpoint = currentWorkspace ? "/attendance" : "/personal/attendance";
            // Ensure Admins only see their own attendance on this page by passing userId
            const params = currentWorkspace ? { userId: currentUser?._id } : {};

            const response = await axiosInstance.get(endpoint, { params });
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to load attendance history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const getStatusPill = (status) => {
        switch (status) {
            case 'Present':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-300">
                        <CheckCircle className="w-3 h-3" />
                        Present
                    </span>
                );
            case 'Absent':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-300">
                        <XCircle className="w-3 h-3" />
                        Absent
                    </span>
                );
            case 'Leave':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                        <Clock className="w-3 h-3" />
                        On Leave
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout activeMenu={"My Attendance"}>
            <div className="my-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentWorkspace ? `Attendance - ${currentWorkspace.name}` : "My Attendance (All Workspaces)"}
                </h2>
                <p className="text-gray-500 mb-6">
                    Viewing records for the last 30 days.
                </p>

                {/* Personal Mode: Workspace Wisdom Stats */ }
                {!currentWorkspace && attendanceRecords.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {Object.entries(attendanceRecords.reduce((acc, record) => {
                            if (!record.workspace) return acc;
                            const wsId = record.workspace._id;
                            if (!acc[wsId]) {
                                acc[wsId] = { name: record.workspace.name, total: 0, present: 0 };
                            }
                            acc[wsId].total += 1;
                            if (record.status === 'Present') acc[wsId].present += 1;
                            return acc;
                        }, {})).map(([wsId, stats]) => (
                            <div key={wsId} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{stats.name}</h4>
                                    <p className="text-xs text-gray-500">{stats.present}/{stats.total} Days Present</p>
                                </div>
                                <div className="text-xl font-bold text-indigo-600">
                                    {Math.round((stats.present / stats.total) * 100)}%
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                >
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading records...</div>
                    ) : attendanceRecords.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Day
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        {!currentWorkspace && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Workspace
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Marked By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {attendanceRecords.map((record) => (
                                        <tr key={record._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {moment(record.date).format("MMM Do, YYYY")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {moment(record.date).format("dddd")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusPill(record.status)}
                                            </td>
                                            {!currentWorkspace && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.workspace?.name || 'N/A'}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.markedBy?.name || 'System'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No attendance records found for the last 30 days.
                        </div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default MyAttendance;