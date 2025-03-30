
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

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
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-2">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-primary"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.5 12C19.5 13.3807 18.3807 14.5 17 14.5H13.5C13.0069 14.5 12.615 14.8969 12.615 15.39V15.39C12.615 15.8831 13.0069 16.28 13.5 16.28H16C16.2761 16.28 16.5 16.5039 16.5 16.78V16.78C16.5 17.0561 16.2761 17.28 16 17.28H13.5C12.3954 17.28 11.5 16.3846 11.5 15.28"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.4141 8.03751C14.8799 8.30328 15.2547 8.7205 15.4502 9.25M16.5 12C16.5 10.067 14.933 8.5 13 8.5H10.5C9.94772 8.5 9.5 8.94772 9.5 9.5V13.5C9.5 14.0523 9.94772 14.5 10.5 14.5H13C14.933 14.5 16.5 12.933 16.5 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 18H7.4C6.07452 18 5 16.9255 5 15.6V8.4C5 7.07452 6.07452 6 7.4 6H16.6C17.9255 6 19 7.07452 19 8.4V15.6C19 16.9255 17.9255 18 16.6 18H16M12 18V21M9 21H15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Voice Agent Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              {t("features")}
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              {t("pricing")}
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              {t("documentation")}
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              {t("solutions")}
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              {t("resources")}
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">{t("login")}</Button>
            </Link>
            <Link to="#contact">
              <Button>{t("contact_sales")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("features")}
            </a>
            <a
              href="#pricing"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("pricing")}
            </a>
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("documentation")}
            </a>
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("solutions")}
            </a>
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("resources")}
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t("login")}</Button>
              </Link>
              <Link to="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">{t("contact_sales")}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
