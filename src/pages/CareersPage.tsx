
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const CareersPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("jobs")} />;
};

export default CareersPage;
