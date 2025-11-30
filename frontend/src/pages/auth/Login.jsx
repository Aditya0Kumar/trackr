import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/AuthLayout";
import {
    Eye,
    EyeOff,
    Building,
    Shield,
    ArrowRight,
    LogIn,
    Mail,
    Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import {
    signInFailure,
    signInStart,
    signInSuccess,
} from "../../redux/slice/userSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const { loading } = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
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
            dispatch(signInStart());

            // API call - withCredentials is handled by axiosInstance
            const response = await axiosInstance.post("/auth/sign-in", {
                email,
                password,
            });

            console.log("Login response:", response.data); // Debug log

            // Backend returns user data directly in response.data
            const userData = response.data;

            // Update Redux store with user data
            dispatch(signInSuccess(userData));

            // Redirect based on role
            if (userData.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error); // Debug log

            // Handle different error formats
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const errorMessage =
                    errorData.message || errorData.error || "Login failed";
                setError(errorMessage);
                dispatch(signInFailure(errorMessage));
            } else if (error.message) {
                setError(error.message);
                dispatch(signInFailure(error.message));
            } else {
                setError("Something went wrong. Please try again!");
                dispatch(
                    signInFailure("Something went wrong. Please try again!")
                );
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
                {/* Glass Morphism Card */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                    {/* Animated Gradient Border */}
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

                    <div className="p-6">
                        {/* Logo and Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center mb-6"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex justify-center mb-4"
                            >
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                    <Building className="w-6 h-6 text-white" />
                                </div>
                            </motion.div>

                            <motion.h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                                Trackr
                            </motion.h1>

                            <motion.p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                Construction Progress Tracking
                            </motion.p>
                        </motion.div>

                        {/* Login Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
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
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                        placeholder="site.manager@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            {loading ? (
                                <div className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold cursor-not-allowed">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    Authenticating...
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm"
                                >
                                    <LogIn size={16} className="mr-2" />
                                    ACCESS SITE DASHBOARD
                                    <motion.div
                                        animate={{ x: isHovered ? 5 : 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                        }}
                                    >
                                        <ArrowRight
                                            size={14}
                                            className="ml-2"
                                        />
                                    </motion.div>
                                </motion.button>
                            )}
                        </motion.form>

                        {/* Sign Up Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                New to Trackr?{" "}
                                <Link
                                    to={"/signup"}
                                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                                >
                                    Create Site Account
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default Login;
