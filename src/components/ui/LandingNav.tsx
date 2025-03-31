
import { useState, useEffect } from "react";
import MobileMenu from "./navigation/MobileMenu";
import DesktopNavigation from "./navigation/DesktopNavigation";
import NavLogo from "./navigation/NavLogo";
import NavActions from "./navigation/NavActions";
import MobileMenuToggle from "./navigation/MobileMenuToggle";

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <NavLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Language Selector and CTA Buttons */}
          <NavActions />

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
    </header>
  );
};

export default LandingNav;
