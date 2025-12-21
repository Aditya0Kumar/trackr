import React from 'react';
import UserAvatar from '../UserAvatar';

const AttendanceFormRow = ({ user, attendanceStatus, setAttendanceStatus }) => {
    const statusOptions = [
        { label: 'Present', value: 'Present', color: 'bg-green-500' },
        { label: 'Absent', value: 'Absent', color: 'bg-red-500' },
        { label: 'Leave', value: 'Leave', color: 'bg-yellow-500' },
    ];

    const currentStatus = attendanceStatus[user._id] || 'Absent';

    const handleStatusChange = (status) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [user._id]: status
        }));
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <UserAvatar imageUrl={user.profileImageUrl} size="w-10 h-10" />
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(option.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 border ${
                            currentStatus === option.value
                                ? `${option.color} text-white shadow-md`
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AttendanceFormRow;