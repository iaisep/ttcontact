
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarUserProfileProps {
  sidebarCollapsed: boolean;
  handleLogout: () => void;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ 
  sidebarCollapsed,
  handleLogout
}) => {
  return (
    <div className="mt-4">
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <Avatar className="h-8 w-8 border-2 border-white">
          <AvatarFallback className="bg-gray-200 text-gray-600">A</AvatarFallback>
        </Avatar>
        {!sidebarCollapsed && (
          <div className="ml-2">
            <div className="text-sm font-medium text-gray-700">Alberto Sanchez</div>
            <div className="text-xs text-gray-500 truncate">alberto.sanchez.pena@gmail.com</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarUserProfile;
