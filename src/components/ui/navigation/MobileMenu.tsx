
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  const { t } = useLanguage();

  if (!isMobileMenuOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800 shadow-lg"
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="py-2">
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t("products")}</div>
          <ul className="pl-4 space-y-3">
            <li>
              <Link
                to="/voice-sdk"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("voice_sdk")}
              </Link>
            </li>
            <li>
              <Link
                to="/ai-agents"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("ai_agents")}
              </Link>
            </li>
            <li>
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("features")}
              </a>
            </li>
          </ul>
        </div>
        <Link
          to="/docs"
          className="block py-2 text-gray-800 dark:text-gray-200 hover:text-indigo-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("documentation")}
        </Link>
        <div className="py-2">
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t("resources")}</div>
          <ul className="pl-4 space-y-3">
            <li>
              <Link
                to="/blog"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link
                to="/guides"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("guides")}
              </Link>
            </li>
            <li>
              <Link
                to="/examples"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("examples")}
              </Link>
            </li>
          </ul>
        </div>
        <a
          href="#pricing"
          className="block py-2 text-gray-800 dark:text-gray-200 hover:text-indigo-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("pricing")}
        </a>
        <div className="pt-4 flex flex-col space-y-3">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full">{t("login")}</Button>
          </Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">{t("get_started")}</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
