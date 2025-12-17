import React from "react";
import { motion } from "framer-motion";

const DashboardStatSkeleton = () => {
    const skeletonItems = [
        { delay: 0.1, border: "border-indigo-500" },
        { delay: 0.2, border: "border-yellow-500" },
        { delay: 0.3, border: "border-blue-500" },
        { delay: 0.4, border: "border-green-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skeletonItems.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${item.border} animate-pulse`}
                >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardStatSkeleton;