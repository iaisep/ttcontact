
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-5s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Agentes de voz con IA para transformar tu atención al cliente
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Automatiza la atención telefónica con agentes conversacionales que entienden, responden y resuelven consultas como un humano, disponibles 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="text-base px-6 py-6">
                Comenzar ahora
              </Button>
              <Button size="lg" variant="outline" className="text-base px-6 py-6">
                <Play size={18} className="mr-2" />
                Ver demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-sm text-gray-500 mx-auto">Agente de voz en acción</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4 bg-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-700">
                      ¿En qué puedo ayudarte hoy?
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="mr-4 bg-primary/10 text-gray-800 rounded-2xl rounded-tr-none p-4">
                      Quiero saber el horario de atención al cliente.
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4 bg-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-700">
                      Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00. ¿Necesitas programar alguna consulta fuera de este horario?
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-100 rounded-full z-0"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full z-0"></div>
            </div>
          </motion.div>
        </div>

        {/* Logos de clientes */}
        <div className="mt-20">
          <p className="text-center text-gray-500 mb-8">Empresas que confían en nuestra tecnología</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 1</div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 2</div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 3</div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 4</div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">Logo 5</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
