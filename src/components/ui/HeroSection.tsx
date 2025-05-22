
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    VANTA: {
      WAVES: (config: any) => any;
    };
  }
}

const HeroSection = () => {
  const { t } = useLanguage();
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if VANTA is available and the effect hasn't been initialized yet
    if (window.VANTA && !vantaEffect) {
      // Initialize the VANTA effect
      const effect = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 600,
        minWidth: 600,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4f46e5,
        shininess: 30,
        waveHeight: 15,
        waveSpeed: 1.0,
        zoom: 0.75
      });
      
      setVantaEffect(effect);
      
      // Clean up the effect when component unmounts
      return () => {
        if (effect) effect.destroy();
      };
    }
  }, [vantaEffect]);
  
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      {/* VANTA.WAVES container */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
            Build Voice AI that sounds exactly like a human
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Retell helps you build voice AI with our simple SDK and API that sounds indistinguishable from a human.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
            <Link to="/login">
              <Button size="lg" className="text-base px-6 py-6 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-6 py-6 w-full sm:w-auto border-gray-300 dark:border-gray-700">
              <Play size={16} className="mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-gray-500 dark:text-gray-400 space-x-8"
          >
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              No credit card required
            </span>
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              100 free minutes
            </span>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 md:mt-20 relative max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="w-full overflow-hidden">
              <img 
                src="https://assets-global.website-files.com/648e74f5512794caa3e45a7a/65a070a5bdc4d3713a2d18d8_Frame%2048095999%20(1).png" 
                alt="Voice AI Platform" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-400/10 rounded-full z-0 blur-xl"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-300/20 rounded-full z-0 blur-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
