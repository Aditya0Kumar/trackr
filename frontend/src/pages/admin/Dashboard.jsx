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
import DashboardIllustration from "../../assets/undraw_dashboard_p93p.svg";
import DashboardStatSkeleton from "../../components/DashboardStatSkeleton";

// Updated colors to include Awaiting Verification (Orange)
const STATUS_COLORS = ["#EF4444", "#FACC15", "#F97316", "#22C55E"]; // Red, Yellow, Orange, Green

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    const prepareData = (data) => {
        const dist = data?.taskDistribution || {};
        const lvl = data?.taskPriorityLevel || {};

        setPieChartData([
            { status: "Pending", count: dist.Pending || 0 },
            { status: "In Progress", count: dist.InProgress || 0 },
            { status: "Awaiting Verification", count: dist.AwaitingVerification || 0 },
            { status: "Completed", count: dist.Completed || 0 },
        ].filter(item => item.count > 0)); // Filter out zero counts for cleaner chart

        setBarChartData([
            { priority: "Low", count: lvl.Low || 0 },
            { priority: "Medium", count: lvl.Medium || 0 },
            { priority: "High", count: lvl.High || 0 },
        ]);
    };

    const fetchDashboard = async () => {
        try {
            const res = await axiosInstance.get("/tasks/dashboard-data");
            if (res.data) {
                setDashboardData(res.data);
                prepareData(res.data.charts);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-6 space-y-6">
                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg overflow-hidden relative"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                        {/* LEFT SIDE: Text and Button */}
                        <div className="flex-1">
                            {/* NAME WITH UNDERLINE */}
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl md:text-3xl font-bold text-gray-900 relative inline-block"
                            >
                                Welcome, {currentUser?.name}
                                {/* UNDERLINE */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: 0.2,
                                    }}
                                    className="
            absolute
            -bottom-1
            left-0
            h-[2px]
            w-full
            origin-left
            bg-indigo-500/40
            rounded-full
          "
                                />
                            </motion.h2>

                            {/* DATE */}
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="text-gray-500 text-sm mt-1 mb-6"
                            >
                                {moment().format("dddd, Do MMMM YYYY")}
                            </motion.p>

                            {/* BUTTON */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.25 }}
                                onClick={() => navigate("/admin/create-task")}
                                className="
        bg-indigo-600 text-white
        font-semibold
        px-5 py-2.5
        rounded-lg
        shadow-md
        hover:bg-indigo-700
        transition
      "
                            >
                                + Create Task
                            </motion.button>
                        </div>

                        {/* RIGHT SIDE: Illustration */}
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            src={DashboardIllustration}
                            alt="Dashboard Illustration"
                            className="w-full max-w-xs md:max-w-sm h-auto mt-4 md:mt-0"
                        />
                    </div>
                </motion.div>

                {/* STATS */}
                {dashboardData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-gray-500 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {dashboardData?.charts?.taskDistribution?.All || 0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white border border-red-300 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-red-600 text-sm font-medium">
                                Pending
                            </p>
                            <p className="text-3xl font-bold text-red-700 mt-2">
                                {dashboardData?.charts?.taskDistribution?.Pending ||
                                    0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white border border-yellow-300 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-yellow-600 text-sm font-medium">
                                In Progress
                            </p>
                            <p className="text-3xl font-bold text-yellow-700 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.InProgress || 0}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white border border-orange-300 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-orange-600 text-sm font-medium">
                                Awaiting Verification
                            </p>
                            <p className="text-3xl font-bold text-orange-700 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.AwaitingVerification || 0}
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white border border-green-300 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-green-600 text-sm font-medium">
                                Completed
                            </p>
                            <p className="text-3xl font-bold text-green-700 mt-2">
                                {dashboardData?.charts?.taskDistribution
                                    ?.Completed || 0}
                            </p>
                        </motion.div>
                    </div>
                ) : (
                    <DashboardStatSkeleton />
                )}

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
                    >
                        <h3 className="text-gray-900 font-semibold mb-4">
                            Task Distribution
                        </h3>
                        <div className="h-64">
                            {dashboardData ? (
                                <CustomPieChart
                                    data={pieChartData}
                                    colors={STATUS_COLORS}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center animate-pulse">
                                    <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
                    >
                        <h3 className="text-gray-900 font-semibold mb-4">
                            Priority Levels
                        </h3>
                        <div className="h-64">
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

                {/* Recent Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
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

export default Dashboard;