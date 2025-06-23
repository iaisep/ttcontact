
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import DashboardContent from "@/components/dashboard/DashboardContent";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";
import { useSidebarState } from "@/hooks/useSidebarState";

const Dashboard = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("agents");
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebarState();

  // Handle navigation state to set active section
  useEffect(() => {
    if (location.state?.activeSection) {
      console.log('Setting active section from navigation state:', location.state.activeSection);
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

  // Also handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'chat-agents') {
      console.log('Setting active section from hash:', hash);
      setActiveSection('chat-agents');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <SidebarWrapper
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      >
        <DashboardContent activeSection={activeSection} />
      </SidebarWrapper>
    </div>
  );
};

export default Dashboard;
