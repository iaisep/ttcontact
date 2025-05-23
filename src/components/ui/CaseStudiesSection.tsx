
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CaseStudiesSection = () => {
  const { t } = useLanguage();

  const caseStudies = [
    {
      title: "How TrustBank reduced call center costs by 45% with voice AI",
      description: "TrustBank implemented our voice AI solution to handle routine customer inquiries, resulting in shorter wait times and significant cost savings.",
      image: "/public/success/2.webp",
      category: "Financial Services"
    },
    {
      title: "HealthPlus: Scaling patient appointment scheduling with AI",
      description: "HealthPlus used our voice agents to automate appointment scheduling, reducing no-shows by 35% and improving patient satisfaction.",
      image: "/public/success/1.webp",
      category: "Healthcare"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            Case Studies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Success stories from real customers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Learn how leading companies are transforming their operations with our voice AI technology
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
            >
              <div className="h-60 overflow-hidden">
                <img 
                  src={study.image} 
                  alt={study.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-indigo-600 font-medium mb-2">{study.category}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{study.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{study.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
