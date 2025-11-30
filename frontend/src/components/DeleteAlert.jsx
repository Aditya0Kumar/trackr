import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
    return (
        <div className="text-gray-300">
            <p className="text-sm text-gray-300">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="flex text-xs font-medium text-red-400 whitespace-nowrap 
                     bg-red-900/30 border border-red-800 
                     rounded-lg px-4 py-2 cursor-pointer 
                     hover:bg-red-600 hover:text-white 
                     transition-colors duration-200 shadow-sm"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;
