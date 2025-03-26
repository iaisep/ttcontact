
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

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
