
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  return (
    <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
      <Globe className="h-4 w-4 text-muted-foreground ml-2" />
      <select 
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none py-1 px-2 text-gray-700 dark:text-gray-300"
        aria-label={t("choose_language")}
      >
        <option value="es">🇪🇸 {t("spanish")}</option>
        <option value="en">🇺🇸 {t("english")}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
