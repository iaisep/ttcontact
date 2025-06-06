
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, HeartPulse, Building2, ShoppingCart, Briefcase, School } from 'lucide-react';

const IndustriesSection = () => {
  const { t } = useLanguage();

  const industries = [
    {
      icon: <Phone className="w-6 h-6 text-indigo-600" />,
      title: t("industry_call_centers"),
      description: t("call_centers_description")
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-indigo-600" />,
      title: t("industry_healthcare"),
      description: t("healthcare_description")
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: t("industry_financial"),
      description: "Proporciona información de cuentas, procesa transacciones y ofrece orientación financiera personalizada a través de IA de voz."
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-indigo-600" />,
      title: t("industry_retail"),
      description: "Mejora el servicio al cliente con seguimiento de pedidos, recomendaciones de productos y procesamiento de devoluciones vía voz natural."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      title: t("industry_sales"),
      description: "Califica prospectos, realiza seguimientos y programa demostraciones con agentes de IA que suenan como tus mejores representantes de ventas."
    },
    {
      icon: <School className="w-6 h-6 text-indigo-600" />,
      title: t("industry_education"),
      description: "Apoya la inscripción de estudiantes, responde preguntas comunes y proporciona información sobre cursos y programas."
    }
  ];

  return (
    <section id="industries" className="py-20 bg-gradient-to-b from-indigo-50/30 to-white dark:from-indigo-950/10 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            {t('industries_section_title')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('industries_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('industries_subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                {industry.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{industry.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{industry.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesSection;
