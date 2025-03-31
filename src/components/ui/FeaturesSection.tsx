
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic, Brain, MessageSquare, Code, Headphones, Zap, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-indigo-600" />,
      title: t("advanced_voice_recognition"),
      description: t("voice_recognition_description")
    },
    {
      icon: <Brain className="w-6 h-6 text-indigo-600" />,
      title: t("natural_language_processing"),
      description: t("nlp_description")
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      title: t("personalized_responses"),
      description: t("personalized_responses_description")
    },
    {
      icon: <Code className="w-6 h-6 text-indigo-600" />,
      title: t("simple_api_integration"),
      description: t("api_integration_description")
    },
    {
      icon: <Headphones className="w-6 h-6 text-indigo-600" />,
      title: t("human_agent_transfer"),
      description: t("human_agent_transfer_description")
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: t("continuous_learning"),
      description: t("continuous_learning_description")
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/10 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            {t("features")}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t("features_section_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t("features_section_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("sdk_integration_title")}</h3>
                <p className="text-white/80 text-lg mb-6">{t("sdk_integration_description")}</p>
                <Link to="/docs">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium">
                    {t("view_documentation")}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-sm w-full">
                <div className="text-sm font-mono text-white/70 mb-3">// {t("code_example")}</div>
                <pre className="text-white font-mono text-sm overflow-x-auto p-2">
                  <code>
{`import { VoiceAgent } from '@voice/hub';

const agent = new VoiceAgent({
  apiKey: 'YOUR_API_KEY',
  voice: 'natural-female-1',
  language: 'en-US'
});

agent.onCall((call) => {
  call.say('Hello, how can I help you?');
});`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4">
              {t("industries_section_title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("industries_section_subtitle")}
            </h2>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("customer_service")}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t("customer_service_description")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("healthcare")}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t("healthcare_description")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("sales")}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t("sales_description")}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t("call_centers")}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t("call_centers_description")}</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <img 
                src="https://assets-global.website-files.com/648e74f5512794caa3e45a7a/65a073e30eddd12eba1c81d8_Group%2048095957.png" 
                alt="Industries" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-indigo-300/20 rounded-full blur-xl"></div>
            <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
