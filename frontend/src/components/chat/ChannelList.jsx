import React from "react";
import { Plus, Hash } from "lucide-react";

const ChannelList = ({ groups, selectedGroupId, onSelect, onAddChannel, canAddChannel }) => {
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Channels</h3>
                {canAddChannel && (
                    <button
                        onClick={onAddChannel}
                        className="p-1 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-700 transition"
                        title="Add Channel"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {groups.map((group) => {
                    const isSelected = selectedGroupId === group._id;
                    return (
                        <button
                            key={group._id}
                            onClick={() => onSelect(group._id)}
                            className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md transition text-sm ${
                                isSelected
                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <Hash className={`w-4 h-4 ${isSelected ? "text-indigo-500" : "text-gray-400"}`} />
                            <span className="truncate">{group.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelList;
