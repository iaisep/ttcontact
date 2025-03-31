
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const PressPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("press")} />;
};

export default PressPage;
