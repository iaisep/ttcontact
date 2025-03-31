
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const CookiesPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("cookies")} />;
};

export default CookiesPage;
