
import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApiContext } from "@/context/ApiContext";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useApiContext();
  const navigate = useNavigate();

  // Verificar si hay un plan seleccionado en localStorage
  useEffect(() => {
    const checkSelectedPlan = async () => {
      if (isAuthenticated) {
        const selectedPlan = localStorage.getItem('selectedPlan');
        if (selectedPlan) {
          // Limpiar el localStorage
          localStorage.removeItem('selectedPlan');
          
          // Crear una sesión de checkout para el plan seleccionado
          try {
            const response = await fetch('/api/create-checkout-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              },
              body: JSON.stringify({
                priceId: selectedPlan
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
            // Redirigir al dashboard en caso de error
            navigate('/dashboard');
          }
        }
      }
    };

    checkSelectedPlan();
  }, [isAuthenticated, navigate]);

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  return (
    <div className="w-full max-w-md relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-xl shadow-subtle-lg overflow-hidden"
        >
          {isLogin ? (
            <LoginForm switchToRegister={switchToRegister} />
          ) : (
            <RegisterForm switchToLogin={switchToLogin} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
