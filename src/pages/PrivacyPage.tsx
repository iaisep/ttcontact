
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const PrivacyPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("privacy_policy")} />;
};

export default PrivacyPage;
