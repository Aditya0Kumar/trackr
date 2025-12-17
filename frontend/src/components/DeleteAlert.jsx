import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
    return (
        <div className="text-gray-700">
            <p className="text-sm text-gray-600">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="flex text-xs font-medium text-white whitespace-nowrap 
                     bg-red-600 border border-red-700 
                     rounded-lg px-4 py-2 cursor-pointer 
                     hover:bg-red-700 
                     transition-colors duration-200 shadow-md"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;