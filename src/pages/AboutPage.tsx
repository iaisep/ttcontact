
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const AboutPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("about_us")} />;
};

export default AboutPage;
