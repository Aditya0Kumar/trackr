import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    ArrowRight,
    LogIn,
    Mail,
    Lock,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import { useDispatch, useSelector } from "react-redux";
import {
    signInFailure,
    signInStart,
    signInSuccess,
} from "../../redux/slice/userSlice";

// Import illustration
import SecureLoginSVG from "../../assets/secure-login.svg";

const LoginForm = ({ onSwitch }) => {
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

            const response = await axiosInstance.post("/auth/sign-in", {
                email,
                password,
            });

            const userData = response.data;
            dispatch(signInSuccess(userData));

            if (userData.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Login failed";
            setError(errorMessage);
            dispatch(signInFailure(errorMessage));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-100">
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    src={SecureLoginSVG}
                    alt="Secure Login"
                    className="w-full max-w-xs"
                />
            </div>

            {/* Right Side: Form */}
            <div className="p-8 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Sign in to access your project dashboard.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
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
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="manager@company.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                        
                        {/* Forgot Password Link */}
                        <div className="text-right pt-1">
                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    {loading ? (
                        <div className="w-full flex justify-center items-center py-3 px-4 bg-indigo-500 rounded-xl text-white font-semibold cursor-not-allowed">
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
                            className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm mt-6"
                        >
                            <LogIn size={16} className="mr-2" />
                            SIGN IN
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
                    )}
                </form>

                {/* Switch Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        New to Trackr?{" "}
                        <button
                            type="button"
                            onClick={onSwitch}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Create Site Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;