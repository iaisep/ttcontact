
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  title: string;
  id: string;
  activeSection: string;
  onSelect: (id: string) => void;
  external?: boolean;
  url?: string;
  sidebarCollapsed: boolean;
}

const SidebarMenuItem = ({ 
  icon: Icon, 
  title, 
  id, 
  activeSection, 
  onSelect, 
  external = false,
  url,
  sidebarCollapsed
}: SidebarMenuItemProps) => {
  const handleClick = () => {
    if (!external) {
      onSelect(id);
    } else if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <li>
      <button
        className={`flex items-center w-full px-4 py-2.5 transition-colors text-left ${
          activeSection === id 
            ? 'bg-blue-50 text-blue-600 font-medium' 
            : 'text-gray-500 hover:bg-gray-50'
        }`}
        onClick={handleClick}
      >
        <Icon size={20} className="min-w-[20px] mr-3" />
        {!sidebarCollapsed && <span className="text-sm">{title}</span>}
      </button>
    </li>
  );
};

export default SidebarMenuItem;
