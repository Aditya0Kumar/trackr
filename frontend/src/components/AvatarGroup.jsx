import React from "react";
import UserAvatar from "./UserAvatar";

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
    return (
        <div className="flex items-center">
            {avatars.slice(0, maxVisible).map((avatarUrl, index) => (
                <div
                    key={index}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md -ml-3 first:ml-0"
                >
                    <UserAvatar
                        imageUrl={avatarUrl}
                        size="w-full h-full"
                    />
                </div>
            ))}

            {avatars.length > maxVisible && (
                <div
                    className="w-9 h-9 flex items-center justify-center 
                     bg-gray-200 
                     text-[11px] text-gray-700 
                     font-medium rounded-full 
                     border border-gray-300 -ml-3 shadow-sm"
                >
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;