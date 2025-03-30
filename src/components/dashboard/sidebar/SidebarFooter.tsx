
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import SidebarUsageInfo from "./SidebarUsageInfo";

interface SidebarFooterProps {
  sidebarCollapsed: boolean;
  onLogout: () => void;
}

const SidebarFooter = ({ sidebarCollapsed, onLogout }: SidebarFooterProps) => {
  if (sidebarCollapsed) {
    return (
      <div className="py-4 flex flex-col items-center">
        <SidebarUsageInfo sidebarCollapsed={sidebarCollapsed} />
        <button
          onClick={onLogout}
          className="w-full flex justify-center py-2.5 text-gray-500 hover:text-gray-700"
        >
          <LogOut size={20} />
        </button>
        <button className="w-full flex justify-center py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <SidebarUsageInfo sidebarCollapsed={sidebarCollapsed} />
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="text-sm font-medium">User Name</div>
          <div className="text-xs text-gray-500">user@example.com</div>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
