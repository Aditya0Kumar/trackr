import React from "react";
import { motion } from "framer-motion";
import {
    UserPlus,
    LayoutDashboard,
    Target,
    TrendingUp,
    PlayCircle,
    CheckCircle2,
    HardHat, // New icon for construction theme
    ClipboardCheck, // New icon for verification
} from "lucide-react";

const HowItWorks = () => {
    const steps = [
        {
            icon: HardHat, // Changed icon
            title: "Setup Site & Team",
            description:
                "Create your account and define your construction site structure. Invite site managers and engineers easily.",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: LayoutDashboard,
            title: "Define Milestones & Tasks",
            description:
                "Break down the project into phases and tasks. Set clear deadlines and assign responsibilities.",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: ClipboardCheck, // Changed icon
            title: "Execute & Request Verification",
            description:
                "Engineers complete tasks on-site and submit them for verification using mandatory checklists.",
            color: "from-green-500 to-emerald-500",
        },
        {
            icon: TrendingUp,
            title: "Verify & Report Progress",
            description:
                "Managers verify completion, generate progress reports, and optimize the workflow for faster delivery.",
            color: "from-orange-500 to-red-500",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const stepVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    return (
        <section
            id="how-it-works"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                    >
                        <PlayCircle className="w-4 h-4" />
                        Simple Site Workflow
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How Trackr
                        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {" "}
                            Manages Construction
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get started in minutes and see results immediately. Our
                        intuitive platform makes project management effortless.
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden lg:block" />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="relative mb-16 last:mb-0"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                {/* Content Side */}
                                <motion.div
                                    variants={stepVariants}
                                    className="flex-1 lg:pr-12"
                                >
                                    <div className="flex items-start gap-6">
                                        {/* Step Number */}
                                        <motion.div
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 360,
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center font-bold text-lg relative`}
                                        >
                                            {/* Animated Checkmark for completed steps */}
                                            {index < 2 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="absolute -top-1 -right-1"
                                                >
                                                    <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full" />
                                                </motion.div>
                                            )}
                                            {index + 1}
                                        </motion.div>

                                        {/* Text Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className={`p-2 rounded-lg bg-gradient-to-r ${step.color} text-white`}
                                                >
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 text-lg leading-relaxed">
                                                {step.description}
                                            </p>

                                            {/* Features List */}
                                            <motion.ul
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="mt-4 space-y-2"
                                            >
                                                {[
                                                    "Easy setup process",
                                                    "Intuitive interface",
                                                    "Real-time collaboration",
                                                ].map(
                                                    (feature, featureIndex) => (
                                                        <motion.li
                                                            key={feature}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -20,
                                                            }}
                                                            whileInView={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    0.4 +
                                                                    featureIndex *
                                                                        0.1,
                                                            }}
                                                            className="flex items-center gap-2 text-gray-600"
                                                        >
                                                            <div
                                                                className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`}
                                                            />
                                                            {feature}
                                                        </motion.li>
                                                    )
                                                )}
                                            </motion.ul>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Image/Visual Side */}
                                <motion.div
                                    variants={imageVariants}
                                    className="flex-1 lg:pl-12"
                                >
                                    <div className="relative">
                                        {/* Mockup Container */}
                                        <motion.div
                                            whileHover={{
                                                y: -10,
                                                scale: 1.02,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative overflow-hidden"
                                        >
                                            {/* Mockup Content */}
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8">
                                                <div className="space-y-4">
                                                    {/* Mock Header */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.color}`}
                                                            />
                                                            <div className="text-sm font-semibold text-gray-700">
                                                                Phase{" "}
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {[
                                                                1, 2, 3,
                                                            ].map(
                                                                (dot) => (
                                                                    <div
                                                                        key={
                                                                            dot
                                                                        }
                                                                        className="w-2 h-2 rounded-full bg-gray-300"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Mock Content */}
                                                    <div className="space-y-3">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                        <div className="h-20 bg-gray-200 rounded mt-4"></div>
                                                    </div>

                                                    {/* Mock Progress */}
                                                    <div className="pt-4">
                                                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                                                            <span>
                                                                Site Progress
                                                            </span>
                                                            <span>
                                                                {(
                                                                    ((index +
                                                                        1) /
                                                                        steps.length) *
                                                                    100
                                                                ).toFixed(
                                                                    0
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                whileInView={{
                                                                    width: `${
                                                                        ((index +
                                                                            1) /
                                                                            steps.length) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                                transition={{
                                                                    duration: 1,
                                                                    delay: 0.5,
                                                                }}
                                                                className={`h-full bg-gradient-to-r ${step.color}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Floating Elements */}
                                            <motion.div
                                                animate={{
                                                    y: [0, -20, 0],
                                                    rotate: [0, 5, 0],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    delay: index * 0.5,
                                                }}
                                                className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${step.color} rounded-lg opacity-20`}
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center"
                >
                    {[
                        { number: "2min", label: "Site Setup Time" },
                        { number: "95%", label: "Manager Satisfaction" },
                        { number: "24/7", label: "Support Available" },
                        { number: "99.9%", label: "Uptime Guarantee" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg"
                        >
                            <div className="text-2xl font-bold text-gray-900 mb-2">
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

export default HowItWorks;