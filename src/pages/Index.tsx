
import AuthForm from "@/components/AuthForm";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-2s" }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-5s" }}></div>
      </div>

      {/* Language selector in top right corner */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <header className="w-full max-w-lg mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-primary"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.5 12C19.5 13.3807 18.3807 14.5 17 14.5H13.5C13.0069 14.5 12.615 14.8969 12.615 15.39V15.39C12.615 15.8831 13.0069 16.28 13.5 16.28H16C16.2761 16.28 16.5 16.5039 16.5 16.78V16.78C16.5 17.0561 16.2761 17.28 16 17.28H13.5C12.3954 17.28 11.5 16.3846 11.5 15.28"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.4141 8.03751C14.8799 8.30328 15.2547 8.7205 15.4502 9.25M16.5 12C16.5 10.067 14.933 8.5 13 8.5H10.5C9.94772 8.5 9.5 8.94772 9.5 9.5V13.5C9.5 14.0523 9.94772 14.5 10.5 14.5H13C14.933 14.5 16.5 12.933 16.5 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 18H7.4C6.07452 18 5 16.9255 5 15.6V8.4C5 7.07452 6.07452 6 7.4 6H16.6C17.9255 6 19 7.07452 19 8.4V15.6C19 16.9255 17.9255 18 16.6 18H16M12 18V21M9 21H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {t("voice_agent_hub")}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              {t("hero_subtitle")}
            </p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AuthForm />
        </motion.div>

        <footer className="w-full mt-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-gray-500"
          >
            © {new Date().getFullYear()} Voice Agent Hub. {t("all_rights_reserved")}
          </motion.p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
