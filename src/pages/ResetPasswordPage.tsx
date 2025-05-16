
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import LandingNav from "@/components/ui/LandingNav";
import Footer from "@/components/ui/Footer";

const ResetPasswordPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-2s" }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-5s" }}></div>
      </div>

      {/* Navigation */}
      <LandingNav />

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
                    d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 17L12 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {t("reset_password")}
            </h1>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-subtle-lg overflow-hidden">
            <ResetPasswordForm />
          </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
