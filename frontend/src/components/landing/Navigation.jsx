import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";
import Logo from "../../assets/logo.png";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    const dashboardPath = currentUser?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    const NavLinks = () => (
        <>
            <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
                Features
            </a>
            <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
                How It Works
            </a>
            <a
                href="#cta"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
                Pricing
            </a>
        </>
    );

    const AuthButtons = () => {
        if (currentUser) {
            return (
                <Link
                    to={dashboardPath}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                </Link>
            );
        }

        return (
            <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
            >
                Sign In
            </Link>
        );
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={Logo} alt="Trackr Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-gray-900">
                            Trackr
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLinks />
                        <div className="flex items-center gap-4">
                            <AuthButtons />
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
                            <NavLinks />
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                                {currentUser ? (
                                    <Link
                                        to={dashboardPath}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl text-center hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-blue-600 transition-colors py-2 font-medium text-center"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navigation;