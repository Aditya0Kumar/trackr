import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer"; // Import Footer

const Landing = () => {
    return (
        <LandingLayout>
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <CTASection />
            <Footer /> {/* Add Footer */}
        </LandingLayout>
    );
};

export default Landing;