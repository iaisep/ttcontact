
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { signUpWithEmail } from "@/lib/supabase";
import { getValidationError } from "@/lib/validators";
import { useLanguage } from "@/context/LanguageContext";

interface RegisterFormProps {
  switchToLogin: () => void;
}

const RegisterForm = ({ switchToLogin }: RegisterFormProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: getValidationError("name", name),
      email: getValidationError("email", email),
      password: getValidationError("password", password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { user, error } = await signUpWithEmail(email, password, name);
      
      if (user && !error) {
        // Registration successful, Supabase will send confirmation email
        // We'll switch to login view
        switchToLogin();
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-md px-8 py-10">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("create_account")}</h1>
        <p className="text-muted-foreground">
          {t("register_access")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("your_name")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            className={`h-12 ${
              errors.name ? "border-red-500 focus:ring-red-500/10" : ""
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 animate-slide-down">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("your_email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            className={`h-12 ${
              errors.email ? "border-red-500 focus:ring-red-500/10" : ""
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 animate-slide-down">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="register-password"
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
              aria-label={showPassword ? t("hide_password") : t("show_password")}
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
          <p className="text-xs text-muted-foreground">
            {t("password_min")}
          </p>
        </div>

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
              {t("processing")}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus size={18} className="mr-2" /> {t("register")}
            </span>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("have_account")}{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-primary hover:underline font-medium"
            >
              {t("log_in")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
