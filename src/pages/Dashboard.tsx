
import { useState } from "react";
import { Toaster } from "sonner";
import DashboardContent from "@/components/dashboard/DashboardContent";
import SidebarWrapper from "@/components/dashboard/sidebar/SidebarWrapper";
import { useSidebarState } from "@/hooks/useSidebarState";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("agents");
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebarState();

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
