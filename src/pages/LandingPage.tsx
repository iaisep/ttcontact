
import LandingNav from "@/components/ui/LandingNav";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import PricingSection from "@/components/ui/PricingSection";
import ContactSection from "@/components/ui/ContactSection";
import Footer from "@/components/ui/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
