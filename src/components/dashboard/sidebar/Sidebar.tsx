
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
    <div className="">
      <SidebarHeader sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <SidebarMenu 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        sidebarCollapsed={sidebarCollapsed} 
      />
      
      <SidebarFooter 
        sidebarCollapsed={sidebarCollapsed} 
        onLogout={onLogout} 
      />
    </div>
  );
};

export default Sidebar;
