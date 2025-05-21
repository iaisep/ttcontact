
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  const { t } = useLanguage();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: isMobileMenuOpen ? 1 : 0,
        height: isMobileMenuOpen ? "auto" : 0,
      }}
      transition={{ duration: 0.3 }}
      className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col space-y-4">
          {/* Products dropdown */}
          <div>
            <button
              onClick={() => toggleSubmenu("products")}
              className="w-full flex items-center justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="text-base font-medium">{t("products")}</span>
              {openSubmenu === "products" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
            {openSubmenu === "products" && (
              <div className="pl-4 pt-2 pb-1 space-y-2">
                <Link
                  to="/voice-sdk"
                  onClick={closeMenu}
                  className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t("voice_sdk")}
                </Link>
                <Link
                  to="/ai-agents"
                  onClick={closeMenu}
                  className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t("ai_agents")}
                </Link>
              </div>
            )}
          </div>

          {/* Documentation link */}
          <Link
            to="/help-center"
            onClick={closeMenu}
            className="py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {t("documentation")}
          </Link>

          {/* Resources dropdown */}
          <div>
            <button
              onClick={() => toggleSubmenu("resources")}
              className="w-full flex items-center justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="text-base font-medium">{t("resources")}</span>
              {openSubmenu === "resources" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
            {openSubmenu === "resources" && (
              <div className="pl-4 pt-2 pb-1 space-y-2">
                <Link
                  to="/blog"
                  onClick={closeMenu}
                  className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t("blog")}
                </Link>
                <Link
                  to="/guides"
                  onClick={closeMenu}
                  className="block py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {t("guides")}
                </Link>
              </div>
            )}
          </div>

          {/* Pricing link */}
          <a
            href="#pricing"
            onClick={closeMenu}
            className="py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {t("pricing")}
          </a>

          {/* Login and Get Started buttons */}
          <div className="pt-2 space-y-3">
            <Link to="/login" onClick={closeMenu}>
              <Button 
                variant="ghost" 
                className="w-full justify-center text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                {t("login")}
              </Button>
            </Link>
            <Link to="/login" onClick={closeMenu}>
              <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
                {t("get_started")}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
