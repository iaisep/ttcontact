
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Spline from "@splinetool/react-spline";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const { t } = useLanguage();
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  // Handle successful loading of Spline
  const handleSplineLoad = () => {
    console.log("Spline scene loaded successfully");
    setSplineLoaded(true);
  };

  // Handle Spline loading error
  const handleSplineError = () => {
    console.error("Error loading Spline scene");
    setSplineError(true);
  };

  return (
    <section className="relative min-h-screen pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      {/* 🌌 Fondo Spline */}
      <div className="absolute inset-0 -z-10 pointer-events-none h-full w-full">
        <Spline
          scene="https://prod.spline.design/1UjZlPEUBkIEmBpR/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
        
        {/* Fallback gradient background in case Spline fails to load */}
        {splineError && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-900"></div>
        )}
      </div>

      {/* 🎨 Gradientes decorativos (opcionales) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent -z-20"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/30 dark:bg-indigo-800/10 rounded-full blur-3xl -z-20"></div>
      <div className="absolute top-32 -left-24 w-80 h-80 bg-blue-100/30 dark:bg-blue-800/10 rounded-full blur-3xl -z-20"></div>

      <div className="container mx-auto px-4 relative z-10">
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
              10 free minutes
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
