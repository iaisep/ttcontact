import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Player } from '@lottiefiles/react-lottie-player';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: t('Build'),
      description: t('Utilize the voice AI API and our intuitive agent builder to create custom voice AI agents effortlessly.'),
      animation: 'https://lottie.host/2917e602-fd52-42ed-9142-be2264c1f3ab/qOaF752qdW.json',
    },
    {
      number: '02',
      title: t('Test'),
      description: t('Perform comprehensive agent testing with built-in test LLM features to ensure seamless handling of edge cases.'),
      animation: 'https://lottie.host/4d363b44-ee86-47d6-8d81-6272ef92a296/eyX7tRFxsP.json',
    },
    {
      number: '03',
      title: t('Deploy'),
      description: t('Easily deploy your agents to phone calls, web calls, SMS, and more.'),
      animation: 'https://lottie.host/03f80b0f-62a0-4c3f-9edf-facbaa8d776d/FONyBJ2OIl.json',
    },
    {
      number: '04',
      title: t('Monitor'),
      description: t('Track success rates, latency, and user sentiment through call history dashboard. Quickly identify failed calls'),
      animation: 'public/lovable-uploads/Animation - 1747946871596.json',
    },
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
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <Player
                  autoplay
                  loop
                  src={step.animation}
                  style={{ height: '100%', width: '100%' }}
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

