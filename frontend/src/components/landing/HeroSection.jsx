import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, ArrowRight } from "lucide-react"; // Removed Play

const HeroSection = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e) => {
            setMouse({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            });
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-7xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        transform: `translate(${mouse.x * 10}px, ${
                            mouse.y * 8
                        }px)`,
                    }}
                    className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8"
                >
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                        Streamline Site Management with Trackr
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                        transform: `translate(${mouse.x * 15}px, ${
                            mouse.y * 12
                        }px)`,
                    }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                >
                    Construction Progress
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tracked in Real-Time
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{
                        transform: `translate(${mouse.x * 8}px, ${
                            mouse.y * 6
                        }px)`,
                    }}
                    className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Assign tasks to site engineers, verify checklist completion,
                    and monitor project milestones from foundation to finish.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                        transform: `translate(${mouse.x * 20}px, ${
                            mouse.y * 15
                        }px)`,
                    }}
                    className="flex items-center justify-center mb-16"
                >
                    <Link
                        to="/signup"
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                    >
                        Start Site Tracking
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    {[
                        { number: "100+", label: "Sites Managed" },
                        { number: "50K+", label: "Tasks Verified" },
                        { number: "99%", label: "On-Time Delivery" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;