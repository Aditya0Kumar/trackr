import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";

const Landing = () => {
    return (
        <LandingLayout>
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <CTASection />
        </LandingLayout>
    );
};

export default Landing;
