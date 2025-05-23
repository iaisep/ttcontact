
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: "The power of IA helped us scale our customer support operations without sacrificing quality. The voice agents are so natural that our customers can't tell they're talking to AI.",
      author: "Sarah Johnson",
      position: "CTO, TechFusion",
      company: "TechFusion",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "We've seen a 40% increase in lead qualification since implementing the power of IA. It's been a game-changer for our sales team.",
      author: "Michael Chen",
      position: "VP of Sales, SalesTrain",
      company: "SalesTrain",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "The voice quality is extraordinary. After years of disappointing experiences with other voice AI solutions, the power of IA finally delivers natural-sounding conversations.",
      author: "Elena Rodriguez",
      position: "Customer Experience Director, Global Health",
      company: "Global Health",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Loved by customers worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            See what our customers have to say about their experience with our voice AI solutions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-4.418 0-8 3.582-8 8v12h8v-12h-4c0-2.209 1.791-4 4-4v-4zM26 8c-4.418 0-8 3.582-8 8v12h8v-12h-4c0-2.209 1.791-4 4-4v-4z"></path>
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-70">
            <div className="flex items-center">
              <span className="text-4xl font-bold text-indigo-600 mr-2">98%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm max-w-[100px] text-left">Customer satisfaction rate</span>
            </div>
            <div className="flex items-center">
              <span className="text-4xl font-bold text-indigo-600 mr-2">40%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm max-w-[100px] text-left">Increase in customer engagement</span>
            </div>
            <div className="flex items-center">
              <span className="text-4xl font-bold text-indigo-600 mr-2">60%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm max-w-[100px] text-left">Cost reduction in customer support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
