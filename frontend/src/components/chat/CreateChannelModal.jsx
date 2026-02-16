import React, { useState } from "react";
import Modal from "../Modal";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";

const CreateChannelModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            const res = await axiosInstance.post("/workspace-groups", { name: name.trim() });
            onCreate(res.data); // Parent handles navigation and refetch
            setName("");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create channel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Channel">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Channel Name
                    </label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. backend-team"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Channels are open to everyone in the workspace.
                    </p>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                    <button 
                         type="button" 
                         onClick={onClose}
                         className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || !name.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {loading ? "Creating..." : "Create Channel"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateChannelModal;
