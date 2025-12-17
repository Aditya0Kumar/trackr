import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Star,
    ArrowRight,
    CheckCircle2,
    Users,
    Award,
    MessageCircle,
    Mail,
    PhoneCall,
    HardHat, // New icon
} from "lucide-react";

const CTASection = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            // Here you would typically send the email to your backend
            console.log("Email submitted:", email);
            setEmail("");
        }
    };

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Site Manager at BuildCo",
            content:
                "Trackr transformed how our site engineers report progress. We've seen a 40% increase in verification speed since switching.",
            rating: 5,
        },
        {
            name: "Marcus Johnson",
            role: "Construction Director",
            content:
                "The intuitive interface and mandatory verification features helped us maintain quality across 5 major projects seamlessly.",
            rating: 5,
        },
        {
            name: "Elena Rodriguez",
            role: "Project Lead Engineer",
            content:
                "Finally, a project management tool that actually understands the need for strict site progress tracking. Game changer!",
            rating: 5,
        },
    ];

    const plans = [
        {
            name: "Site Starter",
            price: "Free",
            period: "forever",
            description:
                "Perfect for individual site managers and small teams getting started",
            features: [
                "Up to 5 team members",
                "Basic task management",
                "1GB storage for site photos",
                "Email support",
            ],
            cta: "Get Started",
            popular: false,
            color: "from-gray-500 to-gray-700",
        },
        {
            name: "Project Professional",
            price: "$12",
            period: "per month",
            description: "Everything you need for growing construction teams",
            features: [
                "Up to 50 team members",
                "Advanced progress analytics",
                "10GB storage",
                "Priority support",
                "Custom verification workflows",
                "Time tracking",
            ],
            cta: "Start Free Trial",
            popular: true,
            color: "from-blue-500 to-purple-600",
        },
        {
            name: "Enterprise Build",
            price: "Custom",
            period: "tailored",
            description: "For large organizations with complex site needs",
            features: [
                "Unlimited team members",
                "Advanced security & compliance",
                "100GB+ storage",
                "Dedicated project manager",
                "Custom integrations (BIM/ERP)",
                "SLA guarantee",
            ],
            cta: "Contact Sales",
            popular: false,
            color: "from-purple-600 to-pink-600",
        },
    ];

    return (
        <section
            id="cta"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
        >
            <div className="max-w-7xl mx-auto">
                {/* Main CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
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
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-medium mb-6"
                    >
                        <HardHat className="w-4 h-4" />
                        Join 10,000+ Construction Teams
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Ready to Transform Your
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}
                            Site Progress Tracking?
                        </span>
                    </h2>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                        Start your free trial today and experience the
                        difference in construction management efficiency. No credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                        <Link
                            to="/signup"
                            className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3 hover:scale-105"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-8 text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Cancel anytime</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Pricing Plans */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h3 className="text-3xl font-bold text-center mb-12">
                        Simple, Transparent Pricing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={`relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 ${
                                    plan.popular
                                        ? "border-blue-400 shadow-2xl"
                                        : "border-white/20"
                                } transition-all duration-300`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h4 className="text-2xl font-bold mb-2">
                                        {plan.name}
                                    </h4>
                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                        <span className="text-4xl font-bold">
                                            {plan.price}
                                        </span>
                                        {plan.period !== "forever" &&
                                            plan.period !== "tailored" && (
                                                <span className="text-gray-400">
                                                    /{plan.period}
                                                </span>
                                            )}
                                    </div>
                                    <p className="text-gray-400">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <motion.li
                                                key={feature}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay:
                                                        0.3 +
                                                        featureIndex * 0.1,
                                                }}
                                                className="flex items-center gap-3"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                                <span className="text-gray-300">
                                                    {feature}
                                                </span>
                                            </motion.li>
                                        )
                                    )}
                                </ul>

                                <Link
                                    to="/signup"
                                    className={`w-full block text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                                        plan.popular
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:scale-105"
                                            : "bg-white/20 hover:bg-white/30"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h3 className="text-3xl font-bold text-center mb-12">
                        Trusted by Leading Construction Firms
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>

                                <p className="text-gray-300 mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Newsletter Signup */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">
                            Stay Updated on Construction Tech
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Get the latest product updates and site management tips delivered to
                            your inbox.
                        </p>

                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="flex flex-col sm:flex-row gap-4"
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Subscribe
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-green-400 font-semibold"
                                >
                                    🎉 Thank you for subscribing! We've sent you
                                    a confirmation email.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;