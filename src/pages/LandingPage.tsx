
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LandingNav from "@/components/ui/LandingNav";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import PricingSection from "@/components/ui/PricingSection";
import ContactSection from "@/components/ui/ContactSection";
import Footer from "@/components/ui/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const LandingPage = () => {
  const location = useLocation();

  // Scroll to the specific section if the URL contains a hash
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <LandingNav />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default LandingPage;
