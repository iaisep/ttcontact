
import { motion } from "framer-motion";
import { Mic, Brain, MessageSquare, Code, Headphones, Zap } from "lucide-react";

const features = [
  {
    icon: <Mic className="w-6 h-6 text-primary" />,
    title: "Reconocimiento de voz avanzado",
    description: "Entiende acentos, dialectos y expresiones coloquiales con una precisión superior al 95%."
  },
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "Procesamiento de lenguaje natural",
    description: "Comprende el contexto y las intenciones del cliente para ofrecer respuestas más precisas."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
    title: "Respuestas personalizadas",
    description: "Genera respuestas naturales adaptadas a la voz e identidad de tu marca."
  },
  {
    icon: <Code className="w-6 h-6 text-primary" />,
    title: "Integración API sencilla",
    description: "Conéctate con tus sistemas existentes a través de APIs REST y webhooks fáciles de implementar."
  },
  {
    icon: <Headphones className="w-6 h-6 text-primary" />,
    title: "Transferencia a agentes humanos",
    description: "Deriva automáticamente las consultas complejas a tu equipo de soporte cuando sea necesario."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Aprendizaje continuo",
    description: "Mejora constantemente con cada interacción para ofrecer un servicio cada vez más efectivo."
  }
];

const industries = [
  {
    title: "Atención al cliente",
    description: "Automatiza consultas frecuentes, recopila información y ofrece soporte 24/7."
  },
  {
    title: "Sector Salud",
    description: "Programa citas, realiza seguimientos y responde dudas sobre procedimientos médicos."
  },
  {
    title: "Ventas",
    description: "Califica leads, agenda demostraciones y gestiona el seguimiento de clientes potenciales."
  },
  {
    title: "Call Centers",
    description: "Reduce el tiempo de espera y mejora la experiencia de tus clientes con atención inmediata."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Tecnología avanzada que transforma la comunicación
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Nuestros agentes de voz combinan las tecnologías más avanzadas para ofrecer una experiencia conversacional extraordinaria.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Soluciones para cada industria
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Adaptamos nuestros agentes de voz a las necesidades específicas de tu sector.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{industry.title}</h3>
                <p className="text-gray-600 text-sm">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
