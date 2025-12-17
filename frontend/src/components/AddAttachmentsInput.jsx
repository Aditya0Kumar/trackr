import React, { useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim() !== "") {
            setAttachments([...attachments, option.trim()]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <div>
            {attachments.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between 
                     bg-white border border-gray-200 
                     px-3 py-2 rounded-lg mb-3 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <ImAttachment className="text-gray-500" />
                        <p className="text-sm text-gray-800">{item}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <MdDelete className="text-lg text-red-500 hover:text-red-600" />
                    </button>
                </div>
            ))}

            {/* Input Row */}
            <div className="flex items-center gap-4 mt-4">
                <div
                    className="flex items-center gap-3 flex-1 
                        bg-white border border-gray-300 px-3 py-2 rounded-lg"
                >
                    <ImAttachment className="text-gray-500" />
                    <input
                        type="text"
                        value={option}
                        placeholder="Paste file link here"
                        onChange={(e) => setOption(e.target.value)}
                        className="w-full bg-transparent text-sm text-gray-900 
                       focus:outline-none"
                    />
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 
                     hover:bg-indigo-700 text-white rounded-md text-sm shadow-md"
                    onClick={handleAddOption}
                >
                    <IoMdAdd className="text-base" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default AddAttachmentsInput;