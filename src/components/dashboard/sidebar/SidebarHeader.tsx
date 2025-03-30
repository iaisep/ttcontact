
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarToggle from "./SidebarToggle";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarHeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader = ({ sidebarCollapsed, toggleSidebar }: SidebarHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && <h1 className="text-lg font-semibold">UISEP_IA</h1>}
        </div>
        <SidebarToggle sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      {!sidebarCollapsed && (
        <div className="mt-2 flex items-center justify-between">
          <select className="bg-background border border-input rounded px-2 py-1 text-xs w-full">
            <option>{t('my_workspace')}</option>
            <option>{t('team_workspace')}</option>
            <option>{t('enterprise_workspace')}</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
