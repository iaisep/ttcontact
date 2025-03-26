
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { signInWithEmail, resetPassword } from "@/lib/supabase";
import { getValidationError } from "@/lib/validators";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  switchToRegister: () => void;
}

const LoginForm = ({ switchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      email: getValidationError("email", email),
      password: forgotPassword ? "" : getValidationError("password", password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (forgotPassword) {
        // Handle password reset
        const { success } = await resetPassword(email);
        if (success) {
          setForgotPassword(false);
        }
      } else {
        // Handle login
        const { user, error } = await signInWithEmail(email, password);
        if (user && !error) {
          toast.success("¡Inicio de sesión exitoso!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Error en la autenticación. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-md px-8 py-10">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {forgotPassword ? "Recuperar contraseña" : "Iniciar sesión"}
        </h1>
        <p className="text-muted-foreground">
          {forgotPassword
            ? "Ingresa tu email para recuperar tu contraseña"
            : "Ingresa tus credenciales para acceder a tu cuenta"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`h-12 ${
                errors.email ? "border-red-500 focus:ring-red-500/10" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 animate-slide-down">
              {errors.email}
            </p>
          )}
        </div>

        {!forgotPassword && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-primary hover:underline focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`h-12 pr-10 ${
                  errors.password ? "border-red-500 focus:ring-red-500/10" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="opacity-70" />
                ) : (
                  <Eye size={18} className="opacity-70" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 animate-slide-down">
                {errors.password}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </span>
          ) : forgotPassword ? (
            "Enviar instrucciones"
          ) : (
            <span className="flex items-center justify-center">
              <LogIn size={18} className="mr-2" /> Iniciar sesión
            </span>
          )}
        </Button>

        {forgotPassword ? (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setForgotPassword(false)}
              className="text-sm text-primary hover:underline"
            >
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                onClick={switchToRegister}
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
