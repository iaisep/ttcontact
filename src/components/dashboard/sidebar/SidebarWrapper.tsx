
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useApiContext } from "@/context/ApiContext";
import SidebarMainMenu from "./SidebarMainMenu";
import SidebarFooterMenu from "./SidebarFooterMenu";
import SidebarUsageInfo from "./SidebarUsageInfo";
import SidebarUserProfile from "./SidebarUserProfile";
import SidebarHeader from "./SidebarHeader";

interface SidebarWrapperProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  children: React.ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  activeSection,
  setActiveSection,
  sidebarCollapsed,
  setSidebarCollapsed,
  children,
}) => {
  const navigate = useNavigate();
  const { logout } = useApiContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex h-screen w-full">
        <div className={`border-r transition-all duration-200 ${sidebarCollapsed ? "w-16" : "w-64"}`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header with Logo */}
            <SidebarHeader sidebarCollapsed={sidebarCollapsed} />
            
            {/* Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className={`h-8 w-8 absolute ${sidebarCollapsed ? "right-0 -mr-4" : "right-2"} top-12 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full z-10 shadow-sm`}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
            
            {/* Main Navigation Menu */}
            <div className="flex-1 overflow-y-auto py-2">
              <SidebarMainMenu 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                sidebarCollapsed={sidebarCollapsed} 
              />
            </div>
            
            {/* Footer Section */}
            <div className="px-2 py-2">
              {/* Footer Navigation Items */}
              <SidebarFooterMenu 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                sidebarCollapsed={sidebarCollapsed} 
              />
              
              {/* Organization Usage Info */}
              {!sidebarCollapsed && <SidebarUsageInfo />}
              
              {/* User Profile */}
              <SidebarUserProfile sidebarCollapsed={sidebarCollapsed} handleLogout={handleLogout} />
            </div>
          </div>
        </div>
        <main className="flex-1 transition-all duration-200 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarWrapper;
