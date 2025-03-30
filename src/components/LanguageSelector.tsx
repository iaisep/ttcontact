
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm flex items-center">
      <Globe className="h-4 w-4 text-muted-foreground ml-2" />
      <select 
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none py-1 px-2"
      >
        <option value="es">🇪🇸 Español</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
