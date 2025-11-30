import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/AuthLayout";
import {
    Eye,
    EyeOff,
    Building,
    ArrowRight,
    UserPlus,
    User,
    Mail,
    Lock,
    Key,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";
import axiosInstance from "../../utils/axioInstance";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [adminInviteToken, setAdminInviteToken] = useState("");
    const [showAdminInviteToken, setShowAdminInviteToken] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let profileImageUrl = "";

        if (!fullName) {
            setError("Please enter the name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError(null);

        try {
            if (profilePic) {
                const imageUploadRes = await uploadImage(profilePic);
                profileImageUrl = imageUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/auth/sign-up", {
                name: fullName,
                email,
                password,
                profileImageUrl,
                adminJoinCode: adminInviteToken,
            });

            if (response.data) {
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again!");
            }
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm mx-auto"
            >
                {/* Dark Theme Card */}
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    {/* Gradient Border */}
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: [-100, 100] }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    <div className="p-4">
                        {/* Logo and Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center mb-3"
                        >
                            <div className="flex justify-center mb-2">
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                                    <Building className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <h1 className="text-lg font-bold text-white font-display">
                                Join Trackr
                            </h1>
                            <p className="text-gray-400 text-xs mt-1">
                                Construction Progress Tracking
                            </p>
                        </motion.div>

                        {/* Sign Up Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Profile Photo Selector */}
                            <div className="mb-1">
                                <ProfilePhotoSelector
                                    image={profilePic}
                                    setImage={setProfilePic}
                                />
                            </div>

                            {/* Full Name Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-200 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={12}
                                    />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        className="w-full px-6 py-1.5 text-xs bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="John Site Manager"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-200 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={12}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full px-6 py-1.5 text-xs bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="manager@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-200 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={12}
                                    />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full px-6 py-1.5 text-xs bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-8"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={12} />
                                        ) : (
                                            <Eye size={12} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Admin Invite Token */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-200 mb-1">
                                    Admin Token (Optional)
                                </label>
                                <div className="relative">
                                    <Key
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={12}
                                    />
                                    <input
                                        type={
                                            showAdminInviteToken
                                                ? "text"
                                                : "password"
                                        }
                                        value={adminInviteToken}
                                        onChange={(e) =>
                                            setAdminInviteToken(e.target.value)
                                        }
                                        className="w-full px-6 py-1.5 text-xs bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-8"
                                        placeholder="Admin token"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                        onClick={() =>
                                            setShowAdminInviteToken(
                                                !showAdminInviteToken
                                            )
                                        }
                                    >
                                        {showAdminInviteToken ? (
                                            <EyeOff size={12} />
                                        ) : (
                                            <Eye size={12} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded border border-red-400/20"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="w-full flex justify-center items-center py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 text-xs mt-1"
                            >
                                <UserPlus size={12} className="mr-1" />
                                CREATE ACCOUNT
                                <motion.div
                                    animate={{ x: isHovered ? 2 : 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                    }}
                                >
                                    <ArrowRight size={10} className="ml-1" />
                                </motion.div>
                            </motion.button>
                        </motion.form>

                        {/* Login Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-3 text-center"
                        >
                            <p className="text-gray-400 text-xs">
                                Have an account?{" "}
                                <Link
                                    to={"/login"}
                                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default SignUp;
