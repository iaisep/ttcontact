
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
      title: "Call Centers",
      description: "Transform your call center operations with AI agents that handle tier-1 support and seamlessly transfer to human agents when needed."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-indigo-600" />,
      title: "Healthcare",
      description: "Schedule appointments, follow up with patients, and provide information on services with natural voice interactions."
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: "Financial Services",
      description: "Provide account information, process transactions, and offer personalized financial guidance through voice AI."
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-indigo-600" />,
      title: "Retail & E-commerce",
      description: "Enhance customer service with order tracking, product recommendations, and return processing via natural voice."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      title: "Sales & Marketing",
      description: "Qualify leads, conduct follow-ups, and schedule demonstrations with AI agents that sound like your best sales representatives."
    },
    {
      icon: <School className="w-6 h-6 text-indigo-600" />,
      title: "Education",
      description: "Support student enrollment, answer common questions, and provide information about courses and programs."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50/30 to-white dark:from-indigo-950/10 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            Industries
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Voice AI solutions for every industry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Discover how our voice AI technology can be customized for your specific industry needs
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
              <Link to={`/industries/${industry.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-indigo-600 font-medium mt-4 hover:text-indigo-700">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
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
          <Link to="/industries" className="inline-flex items-center justify-center text-indigo-600 font-medium hover:text-indigo-700">
            View all industry solutions
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesSection;
