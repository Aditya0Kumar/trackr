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
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
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
                                stroke="#ffffff"
                                strokeWidth={2}
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