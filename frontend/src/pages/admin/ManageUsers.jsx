import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axioInstance";
import DashboardLayout from "../../components/DashboardLayout";
import { FaFileAlt } from "react-icons/fa";
import UserCard from "../../components/UserCard";
import toast from "react-hot-toast";
import UserProfileModal from "../../components/UserProfileModal"; // Import the new modal

const ManageUsers = () => {
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State for the user whose profile is open
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAllUsers = async () => {
        if (!currentWorkspace) return;
        try {
            // The backend controller already calculates task stats for each user here
            const response = await axiosInstance.get("/users/get-users");
            if (response.data?.length > 0) setAllUsers(response.data);
        } catch (error) {
            console.log("Error fetching users:", error);
         }
    };

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get("/reports/export/users", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Error downloading user-details report: ", error);
            toast.error(
                "Error downloading user-details report. Please try again!"
            );
        }
    };

    useEffect(() => {
        getAllUsers();
    }, [currentWorkspace]);

    return (
        <DashboardLayout activeMenu={"Team Members"}>
            <div className="mt-5 mb-10 px-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Team Members
                    </h2>

                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2
                       bg-white text-gray-700 rounded-lg 
                       border border-gray-300 hover:bg-gray-100
                       transition shadow-md w-full sm:w-auto justify-center" // added full width on mobile
                        onClick={handleDownloadReport}
                    >
                        <FaFileAlt className="text-lg text-indigo-500" />
                        <span>Download Report</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {allUsers?.map((user) => (
                        <UserCard 
                            key={user._id} 
                            userInfo={user} 
                            onClick={() => handleCardClick(user)} // Add click handler
                        />
                    ))}
                </div>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />
        </DashboardLayout>
    );
};

export default ManageUsers;