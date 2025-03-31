
import UnderConstructionPage from "@/components/ui/UnderConstructionPage";
import { useLanguage } from "@/context/LanguageContext";

const BlogPage = () => {
  const { t } = useLanguage();
  return <UnderConstructionPage title={t("blog")} />;
};

export default BlogPage;
