import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axioInstance";
import { FaUsers } from "react-icons/fa";
import Modal from "./Modal";
import AvatarGroup from "./AvatarGroup";

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUser, setTempSelectedUser] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get("/users/get-users");
            if (response.data?.length > 0) setAllUsers(response.data);
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUser((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUser(tempSelectedUser);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers
        .filter((user) => selectedUser.includes(user._id))
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUser.length === 0) setTempSelectedUser([]);
    }, [selectedUser]);

    return (
        <div className="space-y-4 mt-2">
            {/* Button / Avatar list */}
            {!selectedUserAvatars.length ? (
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 
                     text-gray-200 rounded-md shadow-sm hover:bg-gray-700 transition"
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                >
                    <FaUsers className="text-lg" />
                    Add Members
                </button>
            ) : (
                <div
                    className="cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Members"
            >
                <div className="space-y-4 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {allUsers?.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 
                         bg-gray-900/60 border border-gray-800 rounded-lg 
                         hover:bg-gray-800 transition"
                        >
                            <img
                                src={user.profileImageUrl}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                            />

                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {user.email}
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={tempSelectedUser.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 accent-green-500 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        className="px-4 py-2 bg-gray-800 border border-gray-700 
                       text-gray-300 rounded-md hover:bg-gray-700 transition"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 
                       text-white rounded-md transition"
                        onClick={handleAssign}
                    >
                        Done
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectedUsers;
