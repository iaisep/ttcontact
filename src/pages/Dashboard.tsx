
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

  useEffect(() => {
    // Check if we're navigating from chat agent config page
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

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
