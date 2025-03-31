
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
        <Button variant="ghost" className="text-gray-700 dark:text-gray-200">
          {t("login")}
        </Button>
      </Link>
      <Link to="/login">
        <Button className="bg-primary text-white hover:bg-primary/90">
          {t("get_started")}
        </Button>
      </Link>
    </div>
  );
};

export default NavActions;
