
import { Home } from "lucide-react";

interface SidebarHeaderProps {
  sidebarCollapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ sidebarCollapsed }) => {
  return (
    <div className="flex flex-col gap-2 px-3 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {sidebarCollapsed ? (
            <div className="flex justify-center w-full">
              <Home size={20} className="text-gray-500" />
            </div>
          ) : (
            <>
              <Home size={20} className="text-gray-500" />
              <h1 className="text-lg font-medium text-gray-700">UISEP_IA</h1>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
