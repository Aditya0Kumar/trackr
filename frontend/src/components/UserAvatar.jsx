import React from 'react';
import { User } from 'lucide-react';

const UserAvatar = ({ imageUrl, size = 'w-10 h-10' }) => {
    const isDefaultImage = imageUrl && (
        imageUrl.includes('default-avatar') || 
        imageUrl.includes('usericon.png')
    );

    if (!imageUrl || isDefaultImage) {
        return (
            <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300`}>
                <User className="w-5 h-5" />
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt="User Avatar"
            className={`${size} rounded-full object-cover border-2 border-white shadow-md`}
        />
    );
};

export default UserAvatar;