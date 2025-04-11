
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
    }
  };

  const commonClasses = `flex items-center w-full px-4 py-2.5 transition-colors text-left ${
    activeSection === id 
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300'
  }`;

  if (external && url) {
    return (
      <li>
        <Link
          to={url}
          className={commonClasses}
        >
          <Icon size={20} className="min-w-[20px] mr-3" />
          {!sidebarCollapsed && <span className="text-sm">{title}</span>}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        className={commonClasses}
        onClick={handleClick}
      >
        <Icon size={20} className="min-w-[20px] mr-3" />
        {!sidebarCollapsed && <span className="text-sm">{title}</span>}
      </button>
    </li>
  );
};

export default SidebarMenuItem;
