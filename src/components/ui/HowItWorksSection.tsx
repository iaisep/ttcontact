
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t('how_it_works_step1_title'),
      description: t('how_it_works_step1_description'),
      image: '/lovable-uploads/photo-1487058792275-0ad4aaf24ca7.jpeg' // Code/development image
    },
    {
      number: '02',
      title: t('how_it_works_step2_title'),
      description: t('how_it_works_step2_description'),
      image: '/lovable-uploads/photo-1531297484001-80022131f5a1.jpeg' // Testing with computer image
    },
    {
      number: '03',
      title: t('how_it_works_step3_title'),
      description: t('how_it_works_step3_description'),
      image: '/lovable-uploads/photo-1581091226825-a6a2a5aee158.jpeg' // Person deploying application
    },
    {
      number: '04',
      title: t('how_it_works_step4_title'),
      description: t('how_it_works_step4_description'),
      image: '/lovable-uploads/photo-1605810230434-7631ac76ec81.jpeg' // Monitoring dashboard screens
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('how_it_works_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('how_it_works_subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center"
            >
              <div className="text-6xl font-bold text-indigo-600 mb-4">{step.number}</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={step.image} 
                  alt={`Step ${step.number}: ${step.title}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
