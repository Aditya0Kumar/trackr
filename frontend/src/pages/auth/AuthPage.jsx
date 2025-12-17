import React, { useState } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../../components/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import SignupForm from "../../components/auth/SignupForm";

// --- Main Component ---

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // State to control the flip

    const handleSwitch = () => {
        setIsLogin(!isLogin);
    };

    return (
        <AuthLayout>
            <div className="relative w-full max-w-4xl mx-auto h-[650px] md:h-[600px] perspective-1000">
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
                    }}
                >
                    {/* Front Side: Login */}
                    <div className="absolute inset-0 backface-hidden">
                        <LoginForm onSwitch={handleSwitch} />
                    </div>

                    {/* Back Side: Signup */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                        <SignupForm onSwitch={handleSwitch} />
                    </div>
                </motion.div>
            </div>
        </AuthLayout>
    );
};

export default AuthPage;