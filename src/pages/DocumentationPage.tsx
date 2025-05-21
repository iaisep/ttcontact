
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const DocumentationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    toast.info(t("redirecting_to_help_center"));
    // Redirect to help center instead of home
    const timeout = setTimeout(() => {
      navigate("/help-center");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("documentation")}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t("redirecting_to_help_center")}</p>
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default DocumentationPage;
