import React from "react";

const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap gap-4 justify-center mt-4">
            {payload?.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: entry.color }}
                    ></div>

                    <span className="text-xs text-gray-600 font-medium">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CustomLegend;