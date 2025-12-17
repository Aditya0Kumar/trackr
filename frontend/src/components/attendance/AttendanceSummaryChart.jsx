import React from "react";
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import CustomTooltip from "../CustomTooltip";
import CustomLegend from "../CustomLegend";

const ATTENDANCE_COLORS = {
    Present: "#22C55E", // Green
    Absent: "#EF4444",  // Red
    Leave: "#FACC15",   // Yellow
};

const AttendanceSummaryChart = ({ records = [] }) => {
    // Process records into summary data for the pie chart
    const summary = records.reduce((acc, record) => {
        const status = record.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const data = [
        { status: "Present", count: summary.Present || 0 },
        { status: "Absent", count: summary.Absent || 0 },
        { status: "Leave", count: summary.Leave || 0 },
    ].filter(item => item.count > 0); // Only show statuses with counts > 0

    const chartColors = data.map(item => ATTENDANCE_COLORS[item.status]);

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                No attendance data available for the last 30 days.
            </div>
        );
    }

    // Reformat data for CustomTooltip/CustomLegend compatibility (nameKey should be 'status')
    const formattedData = data.map(item => ({
        name: item.status,
        value: item.count,
        status: item.status // Keep status for color mapping
    }));

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={85}
                        dataKey="value"
                        nameKey="name"
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={chartColors[index % chartColors.length]}
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

export default AttendanceSummaryChart;