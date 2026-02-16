import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axioInstance";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import RecentTasks from "../../components/RecentTasks";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import { motion } from "framer-motion";
import UserDashboardIllustration from "../../assets/undraw_construction-workers_z99i.svg";
import AttendanceSummaryChart from "../../components/attendance/AttendanceSummaryChart";
import DashboardStatSkeleton from "../../components/DashboardStatSkeleton";
import { MessageSquare, ArrowRight } from "lucide-react";

// Standardized Status Colors: Red (Pending), Blue (In Progress), Orange (Awaiting Verification), Green (Completed)
const STATUS_COLORS = ["#EF4444", "#3B82F6", "#F97316", "#22C55E"]; 

const UserDashboard = () => {
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // prepare data for pie chart
    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || {};
        const taskPriorityLevels = data?.taskPriorityLevel || {};

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In Progress", count: taskDistribution?.InProgress || 0 },
            { status: "Awaiting Verification", count: taskDistribution?.AwaitingVerification || 0 },
            { status: "Completed", count: taskDistribution?.Completed || 0 },
        ].filter(item => item.count > 0);

        setPieChartData(taskDistributionData);

        const priorityLevelData = [
            { priority: "Low", count: taskPriorityLevels?.Low || 0 },
            { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
            { priority: "High", count: taskPriorityLevels?.High || 0 },
        ];

        setBarChartData(priorityLevelData);
    };

    const getDashboardData = async () => {
        try {
            // Determine endpoint based on whether we are in a workspace or "My Work" mode
            const endpoint = currentWorkspace 
                ? "/tasks/user-dashboard-data" 
                : "/personal/dashboard";

            const response = await axiosInstance.get(endpoint);

            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || null);
            }
        } catch (error) {
            console.log("Error fetching dashboard data: ", error);
        }
    };

    const getAttendanceData = async () => {
        try {
            // Determine endpoint: Global if no workspace, otherwise standard
            const endpoint = currentWorkspace ? "/attendance" : "/personal/attendance";
            const response = await axiosInstance.get(endpoint);
            setAttendanceRecords(response.data);
        } catch (error) {
            console.log("Error fetching user attendance data: ", error);
        }
    };

    useEffect(() => {
        getDashboardData();
        getAttendanceData();
    }, [currentWorkspace]); // Re-fetch when workspace changes

    return (
        <DashboardLayout activeMenu={"Dashboard"}>
            <div className="p-4 sm:p-6 space-y-6">
                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg text-gray-900 relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
                        {/* LEFT SIDE: Text */}
                        <div className="flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                {currentWorkspace ? `Welcome to ${currentWorkspace.name}` : "My Work (Personal Dashboard)"}
                            </h2>

                            <p className="text-lg text-gray-700 font-medium md:mt-2">
                                Hello, {currentUser?.name}
                            </p>

                            <p className="text-gray-500 mt-1">
                                {moment().format("dddd Do MMMM YYYY")}
                            </p>
                            <p className="text-sm text-gray-600 mt-4 max-w-md">
                                Stay focused on your assigned tasks and track your progress efficiently.
                            </p>
                            
                            {/* Focus Score Badge */}
                            {!currentWorkspace && dashboardData?.statistics?.focusScore !== undefined && (
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                                    <span>🎯 Focus Score:</span>
                                    <span>{dashboardData.statistics.focusScore}%</span>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE: Illustration */}
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            src={UserDashboardIllustration}
                            alt="Construction Workers Illustration"
                            className="w-full max-w-[150px] md:max-w-[200px] h-auto mt-4 md:mt-0"
                        />
                    </div>
                </motion.div>

                {/* STATS */}
                {dashboardData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition"
                        >
                            <h3 className="text-gray-500 text-sm font-medium">
                                Overdue Tasks
                            </h3>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {dashboardData?.statistics?.overdueTasks ||
                                    0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition"
                        >
                            <h3 className="text-gray-500 text-sm font-medium">
                                Pending Tasks
                            </h3>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.Pending || 0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition"
                        >
                            <h3 className="text-gray-500 text-sm font-medium">
                                Awaiting Verification
                            </h3>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.AwaitingVerification || 0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition"
                        >
                            <h3 className="text-gray-500 text-sm font-medium">
                                Completed Tasks
                            </h3>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.Completed || 0}
                            </p>
                        </motion.div>
                    </div>
                ) : (
                    <DashboardStatSkeleton />
                )}

                {/* Charts Section - Now 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Attendance Chart - Shown in both modes (Global or Workspace) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {currentWorkspace ? "Attendance Summary (30 Days)" : "My Attendance (All Workspaces)"}
                        </h3>

                        <div className="h-80">
                            {attendanceRecords?.length > 0 || dashboardData ? (
                                <AttendanceSummaryChart records={attendanceRecords} />
                            ) : (
                                <div className="h-full flex items-center justify-center animate-pulse">
                                    <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Task Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Task Distribution
                        </h3>

                        <div className="h-80">
                            {dashboardData ? (
                                <CustomPieChart
                                    data={pieChartData}
                                    label="Total Balance"
                                    colors={STATUS_COLORS} // Use standardized colors
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center animate-pulse">
                                    <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Task Priority Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Task Priority Levels
                        </h3>

                        <div className="h-80">
                            {dashboardData ? (
                                <CustomBarChart data={barChartData} />
                            ) : (
                                <div className="h-full flex items-center justify-center animate-pulse">
                                    <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Personal Messages Section (Only in Personal Mode) */}
                {!currentWorkspace && (
                     <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Personal Messages</h3>
                                <p className="text-gray-500 text-sm">You have unread conversations waiting.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate("/messages")}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            Open Messages <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* Recent Task Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {dashboardData ? (
                        <RecentTasks tasks={dashboardData?.recentTasks} />
                    ) : (
                        <div className="bg-white mt-6 border border-gray-200 rounded-xl shadow-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 bg-gray-100 rounded"></div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;