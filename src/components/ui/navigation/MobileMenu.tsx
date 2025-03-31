
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  const { t } = useLanguage();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="py-2">
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t("products")}</div>
          <ul className="pl-4 space-y-2">
            <li>
              <Link
                to="/voice-sdk"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("voice_sdk")}
              </Link>
            </li>
            <li>
              <Link
                to="/ai-agents"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("ai_agents")}
              </Link>
            </li>
            <li>
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("features")}
              </a>
            </li>
          </ul>
        </div>
        <Link
          to="/docs"
          className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("documentation")}
        </Link>
        <div className="py-2">
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t("resources")}</div>
          <ul className="pl-4 space-y-2">
            <li>
              <Link
                to="/blog"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link
                to="/guides"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("guides")}
              </Link>
            </li>
            <li>
              <Link
                to="/examples"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("examples")}
              </Link>
            </li>
          </ul>
        </div>
        <a
          href="#pricing"
          className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("pricing")}
        </a>
        <div className="pt-4 flex flex-col space-y-3">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full">{t("login")}</Button>
          </Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">{t("get_started")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
