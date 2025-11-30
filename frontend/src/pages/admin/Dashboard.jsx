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

const STATUS_COLORS = ["#EF4444", "#FACC15", "#22C55E"];

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
            { status: "Completed", count: dist.Completed || 0 },
        ]);

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
                {/* HERO */}
                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 shadow-md backdrop-blur-sm"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* LEFT SIDE */}
                        <div>
                            {/* NAME WITH UNDERLINE */}
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl md:text-3xl font-bold text-white relative inline-block"
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
            bg-white/40
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
                                className="text-gray-400 text-sm mt-1"
                            >
                                {moment().format("dddd, Do MMMM YYYY")}
                            </motion.p>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            onClick={() => navigate("/admin/create-task")}
                            className="
        bg-white text-black
        font-semibold
        px-5 py-2.5
        rounded-lg
        shadow
        hover:bg-gray-200
        transition
      "
                        >
                            + Create Task
                        </motion.button>
                    </div>
                </motion.div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 shadow-md">
                        <p className="text-gray-400 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold text-white mt-2">
                            {dashboardData?.charts?.taskDistribution?.All || 0}
                        </p>
                    </div>

                    <div className="bg-gray-900/60 border border-red-600/40 rounded-xl p-5 shadow-md">
                        <p className="text-red-400 text-sm font-medium">
                            Pending
                        </p>
                        <p className="text-3xl font-bold text-red-300 mt-2">
                            {dashboardData?.charts?.taskDistribution?.Pending ||
                                0}
                        </p>
                    </div>

                    <div className="bg-gray-900/60 border border-yellow-500/40 rounded-xl p-5 shadow-md">
                        <p className="text-yellow-400 text-sm font-medium">
                            In Progress
                        </p>
                        <p className="text-3xl font-bold text-yellow-300 mt-2">
                            {dashboardData?.charts?.taskDistribution
                                ?.InProgress || 0}
                        </p>
                    </div>

                    <div className="bg-gray-900/60 border border-green-600/40 rounded-xl p-5 shadow-md">
                        <p className="text-green-400 text-sm font-medium">
                            Completed
                        </p>
                        <p className="text-3xl font-bold text-green-300 mt-2">
                            {dashboardData?.charts?.taskDistribution
                                ?.Completed || 0}
                        </p>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h3 className="text-white font-semibold mb-4">
                            Task Distribution
                        </h3>
                        <div className="h-64">
                            <CustomPieChart
                                data={pieChartData}
                                colors={STATUS_COLORS}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-md backdrop-blur-sm">
                        <h3 className="text-white font-semibold mb-4">
                            Priority Levels
                        </h3>
                        <div className="h-64">
                            <CustomBarChart data={barChartData} />
                        </div>
                    </div>
                </div>

                {/* Recent Tasks */}
                <RecentTasks tasks={dashboardData?.recentTasks} />
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
