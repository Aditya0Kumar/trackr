import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const isPasswordMatch = password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!isPasswordMatch) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            
            setSuccess(true);
            toast.success("Password reset successfully!");
            
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to reset password. The link may be expired or invalid.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Set New Password
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Enter your new password below.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center py-10"
                        >
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-gray-800">Success!</p>
                            <p className="text-gray-600 mt-2">Your password has been updated. Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit} 
                            className="space-y-4"
                        >
                            {/* New Password Input */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
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
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
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
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                                            password && !isPasswordMatch ? "border-red-500" : "border-gray-300"
                                        } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm`}
                                        placeholder="••••••••"
                                        required
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
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || !isPasswordMatch || !password}
                                className={`w-full flex justify-center items-center py-3 px-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm mt-6 ${
                                    loading || !isPasswordMatch || !password
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                }`}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                ) : (
                                    <Lock size={16} className="mr-2" />
                                )}
                                RESET PASSWORD
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-gray-600 text-sm flex items-center justify-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to Sign In
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default ResetPassword;