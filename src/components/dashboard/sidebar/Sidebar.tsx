import { useNavigate } from "react-router-dom";
import { useApiContext } from "@/context/ApiContext";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarCollapsed,
  setSidebarCollapsed
}: SidebarProps) => {
  const navigate = useNavigate();
  const {
    logout
  } = useApiContext();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return <div className="">
      <SidebarHeader sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <SidebarMenu activeSection={activeSection} setActiveSection={setActiveSection} sidebarCollapsed={sidebarCollapsed} />
      
      <SidebarFooter sidebarCollapsed={sidebarCollapsed} onLogout={handleLogout} />
    </div>;
};
export default Sidebar;