
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const NavActions = () => {
  const { t } = useLanguage();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <LanguageSelector />
      <Link to="/login">
        <Button variant="outline">{t("login")}</Button>
      </Link>
      <Link to="/login">
        <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">{t("get_started")}</Button>
      </Link>
    </div>
  );
};

export default NavActions;
