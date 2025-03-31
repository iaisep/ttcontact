
import { motion } from "framer-motion";
import { Mic, Brain, MessageSquare, Code, Headphones, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-primary" />,
      title: t("advanced_voice_recognition"),
      description: t("voice_recognition_description")
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: t("natural_language_processing"),
      description: t("nlp_description")
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: t("personalized_responses"),
      description: t("personalized_responses_description")
    },
    {
      icon: <Code className="w-6 h-6 text-primary" />,
      title: t("simple_api_integration"),
      description: t("api_integration_description")
    },
    {
      icon: <Headphones className="w-6 h-6 text-primary" />,
      title: t("human_agent_transfer"),
      description: t("human_agent_transfer_description")
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: t("continuous_learning"),
      description: t("continuous_learning_description")
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <div className="bg-gradient-to-r from-blue-600 to-violet-500 rounded-2xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("sdk_integration_title")}</h3>
                <p className="text-white/80 text-lg mb-6">{t("sdk_integration_description")}</p>
                <Link to="/docs" className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition-colors">
                  {t("view_documentation")}
                </Link>
              </div>
              
              <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-sm w-full">
                <div className="text-sm font-mono text-white/70 mb-3">// {t("code_example")}</div>
                <pre className="text-white font-mono text-sm overflow-x-auto p-2">
                  <code>
{`import { VoiceAgent } from '@voice/hub';

const agent = new VoiceAgent({
  apiKey: 'YOUR_API_KEY',
  voice: 'natural-female-1',
  language: 'es-ES'
});

agent.onCall((call) => {
  call.say('Hola, ¿en qué puedo ayudarte?');
});`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
