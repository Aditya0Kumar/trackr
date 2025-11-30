import React from "react";

/**
 * tabs: Array<{label: string, count: number}>
 * activeTab: string
 * setActiveTab: fn
 */
const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
    return (
        <div className="my-2">
            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.label;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            type="button"
                            className={`relative px-3 md:px-4 py-2 text-sm font-medium rounded-md transition
                ${
                    isActive
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "bg-gray-900/30 text-gray-300 hover:bg-gray-900/50"
                }
              `}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{tab.label}</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "bg-gray-800 text-gray-300"
                                    }`}
                                >
                                    {tab.count ?? 0}
                                </span>
                            </div>

                            {isActive && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/20 rounded" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskStatusTabs;
