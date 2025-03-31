
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const AIAgentsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    toast.info(t("page_under_construction"));
    // Redirigir después de un momento
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t("ai_agents")}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t("page_coming_soon")}</p>
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default AIAgentsPage;
