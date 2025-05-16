
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "switch" }) {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { t, language } = useLanguage();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleDarkMode}
          aria-label={language === "es" ? "Cambiar tema" : "Toggle theme"}
        />
        <label htmlFor="theme-toggle" className="text-sm cursor-pointer">
          {isDark ? t("dark_mode") : t("light_mode")}
        </label>
      </div>
    );
  }

  // For the icon variant, display the opposite text in tooltip (what it will change to)
  const tooltipText = isDark ? t("light_mode") : t("dark_mode");
  const ariaLabel = language === 'es' ? "Cambiar tema" : "Toggle theme";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={ariaLabel}
            className="h-8 w-8 rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-300" />
            <span className="sr-only">{isDark ? t("light_mode") : t("dark_mode")}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
