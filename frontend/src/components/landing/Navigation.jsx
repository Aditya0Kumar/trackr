import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, HardHat } from "lucide-react"; // Changed Rocket to HardHat

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                            <HardHat className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Trackr
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            How It Works
                        </a>
                        <a
                            href="#cta"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Pricing
                        </a>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-gray-200"
                    >
                        <div className="flex flex-col gap-4">
                            <a
                                href="#features"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-1"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-1"
                            >
                                How It Works
                            </a>
                            <a
                                href="#cta"
                                className="text-gray-700 hover:text-blue-600 transition-colors py-1"
                            >
                                Pricing
                            </a>
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors py-2 font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl text-center hover:shadow-lg transition-all duration-300 font-semibold"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navigation;