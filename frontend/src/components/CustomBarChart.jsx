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
                return "#4CAF50"; // Green
            case "Medium":
                return "#FFB300"; // Deep Yellow
            case "High":
                return "#F44336"; // Red
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
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-6 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
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