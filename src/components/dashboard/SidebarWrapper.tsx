
import { useNavigate } from "react-router-dom";
import { useApiContext } from "@/context/ApiContext";
import Sidebar from "./sidebar/Sidebar";

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

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-8'}`}>
        {children}
      </main>
    </div>
  );
};

export default SidebarWrapper;
