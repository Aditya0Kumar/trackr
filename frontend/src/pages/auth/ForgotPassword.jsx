import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/forgot-password", { email });
            
            // Backend sends a generic success message regardless of user existence for security
            setMessage(response.data.message);
            toast.success("Check your inbox for the reset link.");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to process request.";
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
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={loading || message}
                            />
                        </div>
                    </div>

                    {/* Messages */}
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
                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                            >
                                {message}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || message}
                        className={`w-full flex justify-center items-center py-3 px-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-sm mt-6 ${
                            loading || message
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
                            <Send size={16} className="mr-2" />
                        )}
                        SEND RESET LINK
                    </motion.button>
                </form>

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

export default ForgotPassword;