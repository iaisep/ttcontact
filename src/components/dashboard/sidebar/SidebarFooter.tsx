
import { Button } from "@/components/ui/button";
import { LogOut, Github, LifeBuoy } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/context/LanguageContext";

const SidebarFooter = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 pt-0">
      <div className="flex items-center justify-between mb-4">
        <ThemeToggle variant="switch" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="w-full">
          <Github className="mr-2 h-4 w-4" />
          {t("github")}
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <LifeBuoy className="mr-2 h-4 w-4" />
          {t("help")}
        </Button>
      </div>
      <Button variant="destructive" size="sm" className="w-full mt-2">
        <LogOut className="mr-2 h-4 w-4" />
        {t("logout")}
      </Button>
    </div>
  );
};

export default SidebarFooter;
