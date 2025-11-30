import React from "react";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="bg-gray-900/90 backdrop-blur-md px-3 py-2 
                      border border-gray-700 rounded-md shadow-md"
            >
                <p className="text-xs text-gray-300 mb-1">{payload[0].name}</p>

                <p className="text-xs text-gray-400">
                    Count:{" "}
                    <span className="text-gray-100 font-semibold">
                        {payload[0].value}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
