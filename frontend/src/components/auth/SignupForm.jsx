import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    ArrowRight,
    UserPlus,
    User,
    Mail,
    Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../ProfilePhotoSelector";
import axiosInstance from "../../utils/axioInstance";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

// Import illustration
import LoginIllustrationSVG from "../../assets/login-illustration.svg";

const SignupForm = ({ onSwitch }) => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let profileImageUrl = "";

        if (!fullName) {
            setError("Please enter the name");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (!password) {
            setError("Please enter the password");
            setLoading(false);
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
            });

            if (response.data) {
                toast.success("Account created successfully! Please sign in.");
                onSwitch(); // Flip back to login
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Signup failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Left Side: Form */}
            <div className="p-8 flex flex-col justify-center order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-4"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Join Trackr and start managing your projects.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Profile Photo Selector */}
                    <div className="flex justify-center mb-2">
                        <ProfilePhotoSelector
                            image={profilePic}
                            setImage={setProfilePic}
                        />
                    </div>

                    {/* Full Name Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="John Site Manager"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="manager@company.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={14} />
                                ) : (
                                    <Eye size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Admin Invite Token */}
                    {/* <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Admin Token (Optional)
                        </label>
                        <div className="relative">
                            <Key
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            <input
                                type={
                                    showAdminInviteToken ? "text" : "password"
                                }
                                value={adminInviteToken}
                                onChange={(e) =>
                                    setAdminInviteToken(e.target.value)
                                }
                                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="Admin token"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() =>
                                    setShowAdminInviteToken(
                                        !showAdminInviteToken
                                    )
                                }
                            >
                                {showAdminInviteToken ? (
                                    <EyeOff size={14} />
                                ) : (
                                    <Eye size={14} />
                                )}
                            </button>
                        </div>
                    </div> */}

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg border border-red-200"
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
                        disabled={loading}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`w-full flex justify-center items-center py-2.5 px-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm mt-4 ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        }`}
                    >
                        <UserPlus size={16} className="mr-2" />
                        {loading ? "CREATING..." : "CREATE ACCOUNT"}
                        <motion.div
                            animate={{ x: isHovered ? 5 : 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                            }}
                        >
                            <ArrowRight size={14} className="ml-2" />
                        </motion.div>
                    </motion.button>
                </form>

                {/* Switch Link */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitch}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Side: Illustration */}
            <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-teal-100 order-1 lg:order-2">
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    src={LoginIllustrationSVG}
                    alt="Sign Up"
                    className="w-full max-w-xs"
                />
            </div>
        </div>
    );
};

export default SignupForm;