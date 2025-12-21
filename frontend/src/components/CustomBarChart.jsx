import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case "Low":
                return "#4CAF50"; // Green (Standardized Low)
            case "Medium":
                return "#FFB300"; // Amber (Standardized Medium)
            case "High":
                return "#F44336"; // Red (Standardized High)
            default:
                return "#999";
        }
    };

    const CustomToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-md shadow-md">
                    <p className="text-xs text-gray-300 mb-1">
                        Priority:
                        <span className="font-semibold text-white ml-1">
                            {payload[0].payload.priority}
                        </span>
                    </p>

                    <p className="text-xs text-gray-300">
                        Count:{" "}
                        <span className="font-semibold text-white ml-1">
                            {payload[0].payload.count}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid stroke="rgba(0,0,0,0.1)" strokeDasharray="3 3" />

                    <XAxis
                        dataKey="priority"
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        stroke="none"
                    />

                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        stroke="none"
                    />

                    <Tooltip
                        content={<CustomToolTip />}
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />

                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data?.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(entry)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;