
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LandingNav from "@/components/ui/LandingNav";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import PricingSection from "@/components/ui/PricingSection";
import ContactSection from "@/components/ui/ContactSection";
import Footer from "@/components/ui/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

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
        <main>
          <HeroSection />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="py-16 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/10 dark:to-transparent -z-10"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-2xl sm:text-3xl mb-8 text-gray-600 dark:text-gray-300">
                Trusted by innovative companies worldwide
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-70 grayscale">
                <img src="https://framerusercontent.com/images/UbS7rZRKMmZ0fOTVAZ3weL2jSE.png" alt="Client Logo" className="h-8 object-contain" />
                <img src="https://framerusercontent.com/images/mIAsKrgLvd7WbLpHOc5l8YbiJIg.png" alt="Client Logo" className="h-8 object-contain" />
                <img src="https://framerusercontent.com/images/EbZOkxmv9wJ8MqOuCYvxlR3cU.png" alt="Client Logo" className="h-8 object-contain" />
                <img src="https://framerusercontent.com/images/m3eUssK5PpYjP0cd3zcDKSUjRjk.png" alt="Client Logo" className="h-8 object-contain" />
                <img src="https://framerusercontent.com/images/6pGm8bmFCMkkUdQXU5Rj76vBlo.png" alt="Client Logo" className="h-8 object-contain" />
              </div>
            </div>
          </motion.div>
          <FeaturesSection />
          <PricingSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default LandingPage;
