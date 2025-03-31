
import { motion } from "framer-motion";
import { Mic, Brain, MessageSquare, Code, Headphones, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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

  const industries = [
    {
      title: t("customer_service"),
      description: t("customer_service_description")
    },
    {
      title: t("healthcare"),
      description: t("healthcare_description")
    },
    {
      title: t("sales"),
      description: t("sales_description")
    },
    {
      title: t("call_centers"),
      description: t("call_centers_description")
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("features_section_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
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
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t("industries_section_title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              {t("industries_section_subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{industry.title}</h3>
                <p className="text-gray-600 text-sm">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
