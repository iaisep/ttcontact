
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Get the hash from the URL when the component mounts
    const hashFromUrl = window.location.hash.substring(1);
    if (hashFromUrl) {
      setHash(hashFromUrl);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {
      password: password.length < 8 ? t("password_min") : "",
      confirmPassword: password !== confirmPassword ? t("passwords_dont_match") : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Update the user's password using Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message);
      } else {
        toast.success(t("password_reset_success"));
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(t("password_reset_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-md px-8 py-10">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("reset_password")}</h1>
        <p className="text-muted-foreground">
          {t("enter_new_password")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-password">{t("new_password")}</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t("confirm_password")}</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
              }}
              className={`h-12 pr-10 ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500/10" : ""
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
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 animate-slide-down">
              {errors.confirmPassword}
            </p>
          )}
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
              <KeyRound size={18} className="mr-2" /> {t("update_password")}
            </span>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("remember_password")}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
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

export default ResetPasswordForm;
