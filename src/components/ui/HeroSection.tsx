
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900/30 dark:to-gray-950 -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      <div className="absolute top-32 -left-24 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
            {t("retell_hero_title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("retell_hero_subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/login">
              <Button size="lg" className="text-base px-6 py-6 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                {t("get_started")}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-6 py-6 w-full sm:w-auto border-gray-300 dark:border-gray-700">
              <Play size={16} className="mr-2" />
              {t("view_demo")}
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
              <li className="flex items-center">
                <Check size={16} className="text-indigo-600 mr-2" />
                {t("no_credit_card")}
              </li>
              <li className="flex items-center">
                <Check size={16} className="text-indigo-600 mr-2" />
                {t("free_minutes")}
              </li>
              <li className="flex items-center">
                <Check size={16} className="text-indigo-600 mr-2" />
                {t("easy_integration")}
              </li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 md:mt-24 relative max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="aspect-video w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <img 
                src="https://framerusercontent.com/images/nXLzC9Z0XqKjdSYJMn3xAkSG3E.png" 
                alt="Voice Agent Demo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-500/10 rounded-full z-0 blur-xl"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-300/20 dark:bg-blue-900/20 rounded-full z-0 blur-xl"></div>
        </motion.div>
        
        {/* Logo section */}
        <div className="mt-24 md:mt-32">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">{t("trusted_companies")}</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale">
            <img src="https://framerusercontent.com/images/UbS7rZRKMmZ0fOTVAZ3weL2jSE.png" alt="Company Logo" className="h-6 md:h-8 object-contain" />
            <img src="https://framerusercontent.com/images/mIAsKrgLvd7WbLpHOc5l8YbiJIg.png" alt="Company Logo" className="h-6 md:h-8 object-contain" />
            <img src="https://framerusercontent.com/images/EbZOkxmv9wJ8MqOuCYvxlR3cU.png" alt="Company Logo" className="h-6 md:h-8 object-contain" />
            <img src="https://framerusercontent.com/images/m3eUssK5PpYjP0cd3zcDKSUjRjk.png" alt="Company Logo" className="h-6 md:h-8 object-contain" />
            <img src="https://framerusercontent.com/images/6pGm8bmFCMkkUdQXU5Rj76vBlo.png" alt="Company Logo" className="h-6 md:h-8 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
