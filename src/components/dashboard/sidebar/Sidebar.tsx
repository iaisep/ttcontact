
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useApiContext } from "@/context/ApiContext";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarCollapsed,
  setSidebarCollapsed,
  onLogout
}: SidebarProps) => {
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`bg-background border-r transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      <SidebarHeader sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <SidebarMenu 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      <SidebarFooter 
        sidebarCollapsed={sidebarCollapsed} 
        onLogout={onLogout} 
      />
    </div>
  );
};

export default Sidebar;
