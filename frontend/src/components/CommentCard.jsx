import React from "react";
import moment from "moment";
import UserAvatar from "./UserAvatar";

const CommentCard = ({ comment }) => {
    return (
        <div className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-shrink-0">
                <UserAvatar 
                    imageUrl={comment.user?.profileImageUrl} 
                    size="w-10 h-10" 
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                        {comment.user?.name || "Unknown User"}
                    </p>
                    <span className="text-xs text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.text}
                </p>
            </div>
        </div>
    );
};

export default CommentCard;