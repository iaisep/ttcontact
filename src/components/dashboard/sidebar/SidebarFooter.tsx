
import { Button } from "@/components/ui/button";
import { LogOut, LifeBuoy } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarFooterProps {
  sidebarCollapsed?: boolean;
  onLogout?: () => void;
}

const SidebarFooter = ({ sidebarCollapsed, onLogout }: SidebarFooterProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 pt-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ThemeToggle variant="switch" />
          {!sidebarCollapsed && (
            <span className="text-sm">{t("theme")}</span>
          )}
        </div>
      </div>
      {!sidebarCollapsed ? (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mb-2"
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            {t("help")}
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="icon">
            <LifeBuoy className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
