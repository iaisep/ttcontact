
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const ExamplesPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("examples")} />;
};

export default ExamplesPage;
