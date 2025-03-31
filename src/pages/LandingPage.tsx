
import LandingNav from "@/components/ui/LandingNav";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import PricingSection from "@/components/ui/PricingSection";
import ContactSection from "@/components/ui/ContactSection";
import Footer from "@/components/ui/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const LandingPage = () => {
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
