import React from "react";

const UserCard = ({ userInfo }) => {
    return (
        <div
            className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 
                    shadow-lg backdrop-blur-xl transition hover:bg-gray-900/70"
        >
            <div className="flex items-center gap-3">
                <img
                    src={userInfo?.profileImageUrl}
                    alt={userInfo?.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-gray-700"
                />

                <div>
                    <p className="text-base font-semibold text-gray-100">
                        {userInfo?.name}
                    </p>
                    <p className="text-sm text-gray-400">{userInfo?.email}</p>
                </div>
            </div>

            {/* Status Trio */}
            <div className="flex items-center gap-3 mt-5">
                <StatCard
                    label="Pending"
                    count={userInfo?.pendingTasks || 0}
                    color="bg-yellow-600/30 text-yellow-300 border-yellow-700"
                />

                <StatCard
                    label="In Progress"
                    count={userInfo?.inProgressTasks || 0}
                    color="bg-blue-600/30 text-blue-300 border-blue-700"
                />

                <StatCard
                    label="Completed"
                    count={userInfo?.completedTasks || 0}
                    color="bg-green-600/30 text-green-300 border-green-700"
                />
            </div>
        </div>
    );
};

export default UserCard;

// Status Pill
const StatCard = ({ label, count, color }) => {
    return (
        <div
            className={`flex flex-1 items-center justify-center gap-1 px-3 py-1 
                  border rounded-lg text-[11px] font-medium ${color}`}
        >
            <span className="font-semibold text-sm">{count}</span>
            <span>{label}</span>
        </div>
    );
};
