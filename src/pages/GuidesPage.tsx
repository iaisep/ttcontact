
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const GuidesPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("guides")} />;
};

export default GuidesPage;
