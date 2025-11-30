import React from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Users,
    BarChart3,
    Shield,
    Clock,
    MessageSquare,
} from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description:
                "Experience blazing fast performance with our optimized task management system. No more waiting for pages to load.",
            color: "from-yellow-500 to-orange-500",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description:
                "Work seamlessly with your team. Assign tasks, share updates, and collaborate in real-time.",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics",
            description:
                "Gain insights with detailed analytics and reports. Track progress and identify bottlenecks.",
            color: "from-green-500 to-emerald-500",
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description:
                "Your data is protected with enterprise-grade security and regular backups.",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: Clock,
            title: "Time Tracking",
            description:
                "Automatically track time spent on tasks and generate accurate timesheets.",
            color: "from-indigo-500 to-blue-500",
        },
        {
            icon: MessageSquare,
            title: "Real-time Chat",
            description:
                "Communicate with your team through integrated real-time messaging and comments.",
            color: "from-red-500 to-pink-500",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const hoverVariants = {
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    };

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                    >
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Everything You Need to
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {" "}
                            Succeed
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Packed with features designed to boost your team's
                        productivity and streamline your workflow.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <motion.div
                                variants={hoverVariants}
                                className="h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                />

                                {/* Animated Border */}
                                <div
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                >
                                    <div className="absolute inset-[2px] rounded-3xl bg-white/80 backdrop-blur-sm" />
                                </div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: [0, -5, 5, 0],
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                                    >
                                        <feature.icon className="w-6 h-6" />
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Arrow */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors"
                                    >
                                        Learn more
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        >
                                            →
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 0.7, 0.3],
                                    }}
                                    transition={{
                                        duration: 3 + index,
                                        repeat: Infinity,
                                        delay: index * 0.5,
                                    }}
                                    className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full opacity-30`}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                Ready to Transform Your Workflow?
                            </h3>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                Join thousands of teams who have already
                                streamlined their project management with
                                Project Flow.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Start Free Trial
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
