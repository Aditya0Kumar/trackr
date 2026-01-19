import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import axiosInstance from "../utils/axioInstance";
import DashboardLayout from "../components/DashboardLayout";
import Modal from "../components/Modal"; 
import { useNavigate } from "react-router-dom";

const Calendar = () => {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(null); // For detail view
    const [loading, setLoading] = useState(false);

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const endpoint = currentWorkspace ? "/tasks" : "/personal/tasks";
            const res = await axiosInstance.get(endpoint);
            
            let fetchedTasks = [];
            if (currentWorkspace) {
                // Workspace endpoint returns { tasks: [], statusSummary: {} }
                fetchedTasks = res.data.tasks || [];
            } else {
                // Personal endpoint returns { allTasks: [], grouped: {} }
                fetchedTasks = res.data.allTasks || [];
            }
            
            // Filter out tasks without due dates
            setTasks(fetchedTasks.filter(t => t.dueDate));
        } catch (error) {
            console.error("Error fetching tasks for calendar:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [currentWorkspace]);

    // Calendar Helper Functions
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startDay = startOfMonth.clone().startOf("week"); // Start grid from Sunday
    const endDay = endOfMonth.clone().endOf("week"); // End grid on Saturday

    const calendarDays = [];
    let day = startDay.clone();

    while (day.isSameOrBefore(endDay)) {
        calendarDays.push(day.clone());
        day.add(1, "day");
    }

    const prevMonth = () => setCurrentDate(currentDate.clone().subtract(1, "month"));
    const nextMonth = () => setCurrentDate(currentDate.clone().add(1, "month"));

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => 
            moment(task.dueDate).isSame(date, 'day')
        );
    };

    // Color Logic
    const getTaskColor = (task) => {
        if (task.status === "Completed") return "bg-green-500";
        if (moment(task.dueDate).isBefore(moment(), 'day')) return "bg-red-500"; // Overdue
        if (moment(task.dueDate).isSame(moment(), 'day')) return "bg-orange-500"; // Due Today
        return "bg-blue-500"; // Upcoming
    };

    const isToday = (date) => moment().isSame(date, "day");
    const isCurrentMonth = (date) => date.month() === currentDate.month();

    return (
        <DashboardLayout activeMenu="Calendar">
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {currentDate.format("MMMM YYYY")}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200 transition">
                            <MdChevronLeft size={24} />
                        </button>
                        <button onClick={() => setCurrentDate(moment())} className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 border border-gray-300">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200 transition">
                            <MdChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Calendar Container */}
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <div className="min-w-[800px] min-h-full flex flex-col">
                        {/* Grid Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                <div key={d} className="text-center text-gray-500 font-semibold text-sm uppercase">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 flex-grow shrink-0 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                            {calendarDays.map((date, idx) => {
                                const dayTasks = getTasksForDate(date);
                                const isSelected = selectedDate && date.isSame(selectedDate, 'day');

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedDate(date)}
                                        className={`min-h-[100px] bg-white p-2 cursor-pointer transition relative
                                            ${!isCurrentMonth(date) ? "bg-gray-50 text-gray-400" : "text-gray-800"}
                                            ${isToday(date) ? "bg-indigo-50" : "hover:bg-gray-50"}
                                            ${isSelected ? "ring-2 ring-indigo-500 inset-0 z-10" : ""}
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                                ${isToday(date) ? "bg-indigo-600 text-white" : ""}
                                            `}>
                                                {date.date()}
                                            </span>
                                        </div>
                                        
                                        {/* Task Dots / Bars */}
                                        <div className="mt-2 space-y-1">
                                            {dayTasks.slice(0, 3).map(task => ( // Show up to 3 dots/bars
                                                <div key={task._id} className="flex items-center gap-1 text-xs truncate">
                                                    <span className={`w-2 h-2 rounded-full ${getTaskColor(task)} flex-shrink-0`} />
                                                    <span className="truncate text-gray-600">{task.title}</span>
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[10px] text-gray-400 pl-3">
                                                    +{dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Selected Date Tasks */}
            {selectedDate && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {selectedDate.format("dddd, MMMM Do YYYY")}
                            </h3>
                            <button onClick={() => setSelectedDate(null)} className="text-gray-500 hover:text-gray-700">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="p-5 max-h-[60vh] overflow-y-auto">
                            {getTasksForDate(selectedDate).length > 0 ? (
                                <div className="space-y-3">
                                    {getTasksForDate(selectedDate).map(task => (
                                        <div 
                                            key={task._id} 
                                            onClick={() => navigate(`/task-details/${task._id}`)}
                                            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer bg-white hover:bg-gray-50 group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${getTaskColor(task)}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {task.description || "No description"}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                                    task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                    'bg-green-50 text-green-600 border-green-200'
                                                }`}>
                                                    {task.priority || "Low"}
                                                </span>
                                                {task.workspace && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        {task.workspace.name || "Workspace"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No tasks due on this day.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                 </div>
            )}
        </DashboardLayout>
    );
};

export default Calendar;
