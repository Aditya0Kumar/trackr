import React from "react";
import {
    Pie,
    PieChart,
    Tooltip,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";

const CustomPieChart = ({ data, colors }) => {
    return (
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-xl p-4 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={85}
                        dataKey="count"
                        nameKey="status"
                    >
                        {data?.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={colors[index % colors.length]}
                                stroke="rgba(0,0,0,0.3)"
                                strokeWidth={1}
                            />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />

                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomPieChart;
