
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
            <AvatarImage src="https://retell-utils-public.s3.us-west-2.amazonaws.com/Dorothy.png" alt="Avatar" />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && <h1 className="text-lg font-semibold">Agentes</h1>}
        </div>
        <SidebarToggle sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      {!sidebarCollapsed && (
        <div className="mt-2 flex items-center justify-between">
          <select className="bg-background border border-input rounded px-2 py-1 text-xs w-full">
            <option>{t('my workspace')}</option>
            <option>{t('team workspace')}</option>
            <option>{t('enterprise workspace')}</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
