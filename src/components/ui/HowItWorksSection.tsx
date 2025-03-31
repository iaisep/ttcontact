
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: 'Build',
      description: 'Utilize the voice AI API and our intuitive agent builder to create custom voice AI agents effortlessly.',
      image: '/lovable-uploads/b48c5652-81ae-437e-9fc7-8d7fca9e4945.png'
    },
    {
      number: '02',
      title: 'Test',
      description: 'Perform comprehensive agent testing with built-in test LLM features to ensure seamless handling of edge cases.',
      image: '/lovable-uploads/b48c5652-81ae-437e-9fc7-8d7fca9e4945.png'
    },
    {
      number: '03',
      title: 'Deploy',
      description: 'Easily deploy your agents to phone calls, web calls, SMS, and more.',
      image: '/lovable-uploads/b48c5652-81ae-437e-9fc7-8d7fca9e4945.png'
    },
    {
      number: '04',
      title: 'Monitor',
      description: 'Track success rates, latency, and user sentiment through call history dashboard. Quickly identify failed calls.',
      image: '/lovable-uploads/b48c5652-81ae-437e-9fc7-8d7fca9e4945.png'
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
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Create powerful, context-aware voice AI agents in four simple steps
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
