import React from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* MODAL CONTENT */}
            <div
                className="
        relative w-full max-w-md mx-4 rounded-2xl shadow-xl border border-gray-800
        bg-gray-900/80 backdrop-blur-xl
        transform animate-modalPop
      "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-100">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition"
                    >
                        <IoMdClose className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 text-gray-300">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
