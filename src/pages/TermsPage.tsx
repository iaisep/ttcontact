
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const TermsPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("terms")} />;
};

export default TermsPage;
