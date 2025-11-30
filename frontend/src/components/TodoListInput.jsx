import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        if (option.trim() !== "") {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    const handleDeleteOption = (index) => {
        setTodoList(todoList.filter((_, i) => i !== index));
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between 
                     bg-gray-900/50 border border-gray-800 
                     px-3 py-2 rounded-lg mb-3"
                >
                    <p className="text-sm text-gray-200">
                        <span className="text-xs text-gray-500 mr-2">
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button
                        type="button"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <MdDelete className="text-lg text-red-500 hover:text-red-400" />
                    </button>
                </div>
            ))}

            {/* Input Row */}
            <div className="flex items-center gap-4 mt-4">
                <input
                    type="text"
                    placeholder="Add a checklist item..."
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 
                     text-gray-200 text-sm px-4 py-2 rounded-lg 
                     focus:outline-none focus:ring-1 focus:ring-gray-600"
                />

                <button
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 
                     hover:bg-blue-700 text-white rounded-md text-sm"
                    type="button"
                    onClick={handleAddOption}
                >
                    <IoMdAdd className="text-base" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
