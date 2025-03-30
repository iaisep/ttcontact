
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useApiContext } from "@/context/ApiContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const plans = [
  {
    name: "Básico",
    price: "49",
    description: "Para pequeñas empresas que comienzan con la automatización",
    features: [
      "Hasta 500 minutos/mes",
      "2 agentes de voz simultáneos",
      "Integraciones básicas",
      "Reportes semanales",
      "Soporte por email"
    ],
    cta: "Comenzar gratis",
    popular: false,
    priceId: "price_basic" // Esto debe ser reemplazado con el ID real de Stripe
  },
  {
    name: "Pro",
    price: "149",
    description: "Para empresas en crecimiento con necesidades de escalabilidad",
    features: [
      "Hasta 2.000 minutos/mes",
      "5 agentes de voz simultáneos",
      "Todas las integraciones",
      "Reportes avanzados",
      "Transferencia a agentes humanos",
      "Soporte prioritario"
    ],
    cta: "Comenzar prueba de 14 días",
    popular: true,
    priceId: "price_pro" // Esto debe ser reemplazado con el ID real de Stripe
  },
  {
    name: "Empresa",
    price: "Personalizado",
    description: "Soluciones a medida para grandes corporaciones",
    features: [
      "Minutos ilimitados",
      "Agentes ilimitados",
      "Integraciones personalizadas",
      "Personalización completa de voz",
      "API dedicada",
      "Soporte 24/7",
      "Gestor de cuenta dedicado"
    ],
    cta: "Contactar ventas",
    popular: false,
    priceId: "price_enterprise" // Esto debe ser reemplazado con el ID real de Stripe
  }
];

const PricingSection = () => {
  const { isAuthenticated } = useApiContext();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    // Para el plan Empresa, simplemente redirigir a contacto
    if (plan.name === "Empresa") {
      navigate("#contact");
      return;
    }

    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
      // Guardar el plan seleccionado en localStorage para recuperarlo después del login
      localStorage.setItem('selectedPlan', plan.priceId);
      toast.info("Necesitas iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, [plan.priceId]: true }));
      
      // Llamada a nuestra función edge para crear la sesión de checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo iniciar el proceso de pago');
      }

      const { url } = await response.json();
      
      // Redirigir a la página de checkout de Stripe
      window.location.href = url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('Hubo un error al procesar tu solicitud');
    } finally {
      setIsLoading(prev => ({ ...prev, [plan.priceId]: false }));
    }
  };

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Planes que se adaptan a tu negocio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Escala según tus necesidades con nuestros planes flexibles. Todos incluyen actualizaciones gratuitas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl border ${
                plan.popular 
                  ? "border-primary shadow-lg relative" 
                  : "border-gray-200 shadow-sm"
              } bg-white overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price === "Personalizado" ? "" : "$"}
                    {plan.price}
                  </span>
                  {plan.price !== "Personalizado" && (
                    <span className="text-gray-600 ml-1">/mes</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full mb-6"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading[plan.priceId]}
                >
                  {isLoading[plan.priceId] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            ¿Necesitas un plan personalizado? <a href="#contact" className="text-primary hover:underline">Contáctanos</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
