import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Save, Upload } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import axiosInstance from "../utils/axioInstance";
import uploadImage from "../utils/uploadImage";
import toast from "react-hot-toast";
import { signInSuccess } from "../redux/slice/userSlice";
import UserAvatar from "../components/UserAvatar";

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isPasswordMatch = password === confirmPassword;
    const isFormDirty =
        name !== currentUser?.name ||
        email !== currentUser?.email ||
        password ||
        profilePicFile;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        if (password && !isPasswordMatch) {
            setError("Passwords do not match.");
            return;
        }

        if (!isFormDirty) {
            toast("No changes detected.", { icon: "ℹ️" });
            return;
        }

        setLoading(true);
        let profileImageUrl = currentUser?.profileImageUrl;

        try {
            // 1. Upload new profile picture if selected
            if (profilePicFile) {
                const uploadRes = await uploadImage(profilePicFile);
                profileImageUrl = uploadRes.imageUrl;
            }

            // 2. Update user profile data
            const updateData = {
                name,
                email,
                profileImageUrl,
            };

            if (password) {
                updateData.password = password;
            }

            const response = await axiosInstance.put(
                "/auth/update-profile",
                updateData
            );

            // 3. Update Redux state
            dispatch(signInSuccess(response.data));
            toast.success("Profile updated successfully!");
            
            // Reset temporary states
            setPassword("");
            setConfirmPassword("");
            setProfilePicFile(null);

        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to update profile.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Profile">
            <div className="p-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                User Profile
                            </h2>
                            <p className="text-sm text-gray-500">
                                Manage your account details and security settings.
                            </p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            currentUser?.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {currentUser?.role === 'admin' ? 'Administrator' : 'Team Member'}
                        </span>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center space-y-4 border-b border-gray-200 pb-6">
                            <div className="relative w-28 h-28">
                                <UserAvatar
                                    imageUrl={
                                        profilePicFile
                                            ? URL.createObjectURL(
                                                  profilePicFile
                                              )
                                            : currentUser?.profileImageUrl
                                    }
                                    size="w-28 h-28"
                                />
                            </div>
                            <ProfilePhotoSelector
                                image={profilePicFile}
                                setImage={setProfilePicFile}
                            />
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="pt-4 border-t border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Change Password (Optional)
                            </h3>
                            
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Leave blank to keep current password"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                                            password && !isPasswordMatch
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm`}
                                    />
                                </div>
                                <AnimatePresence>
                                    {password && !isPasswordMatch && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-500 text-xs mt-1"
                                        >
                                            Passwords do not match.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl border border-red-200"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || !isFormDirty || (password && !isPasswordMatch)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                                loading || !isFormDirty || (password && !isPasswordMatch)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    SAVING...
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    SAVE CHANGES
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;