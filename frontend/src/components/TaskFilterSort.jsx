import React, { useState } from "react";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High"];
const SORT_OPTIONS = [
    { label: "Due Date (Asc)", value: "dueDateAsc" },
    { label: "Due Date (Desc)", value: "dueDateDesc" },
    { label: "Created Date (Asc)", value: "createdAtAsc" },
    { label: "Created Date (Desc)", value: "createdAtDesc" },
];

const TaskFilterSort = ({ filter, setFilter, sort, setSort }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const handlePriorityChange = (priority) => {
        setFilter((prev) => ({ ...prev, priority }));
        setIsFilterOpen(false);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setIsSortOpen(false);
    };

    return (
        <div className="flex gap-3">
            {/* Filter Dropdown (Priority) */}
            <div className="relative">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm font-medium"
                    type="button"
                >
                    <Filter className="w-4 h-4 text-indigo-500" />
                    Priority: {filter.priority}
                </button>

                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 origin-top-right"
                        >
                            {PRIORITY_OPTIONS.map((priority) => (
                                <button
                                    key={priority}
                                    onClick={() => handlePriorityChange(priority)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                                        filter.priority === priority
                                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm font-medium"
                    type="button"
                >
                    {sort.includes("Desc") ? (
                        <SortDesc className="w-4 h-4 text-indigo-500" />
                    ) : (
                        <SortAsc className="w-4 h-4 text-indigo-500" />
                    )}
                    Sort
                </button>

                <AnimatePresence>
                    {isSortOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 origin-top-right"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                                        sort === option.value
                                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TaskFilterSort;