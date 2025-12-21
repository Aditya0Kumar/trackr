import React from "react";
import { Link } from "react-router-dom";
import { HardHat, Mail, Phone, MapPin } from "lucide-react";
import Logo from "../../assets/logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                {/* Column 1: Logo and Description */}
                <div className="col-span-2 md:col-span-2 space-y-4">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={Logo} alt="Trackr Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold text-white">Trackr</span>
                    </Link>
                    <p className="text-sm text-gray-400 max-w-xs">
                        Streamlining construction project management with real-time task tracking and verification.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-3">
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                        <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                        <li><a href="#cta" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                        <li><Link to="/login" className="text-gray-400 hover:text-white transition">Sign In</Link></li>
                    </ul>
                </div>

                {/* Column 3: Resources */}
                <div className="space-y-3">
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div className="col-span-2 md:col-span-1 space-y-3">
                    <h4 className="text-lg font-semibold mb-2 text-indigo-400">Contact</h4>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-400">
                            <Mail className="w-4 h-4 text-indigo-400" />
                            support@trackr.com
                        </p>
                        <p className="flex items-center gap-2 text-gray-400">
                            <Phone className="w-4 h-4 text-indigo-400" />
                            +1 (555) 123-4567
                        </p>
                        <p className="flex items-start gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-indigo-400 mt-1" />
                            123 Site Lane, Construction City
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 pt-6 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                    &copy; {currentYear} Trackr. All rights reserved. Built for modern construction management.
                </p>
            </div>
        </footer>
    );
};

export default Footer;