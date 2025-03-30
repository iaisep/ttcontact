
import { useState } from "react";
import { Toaster } from "sonner";
import DashboardContent from "@/components/dashboard/DashboardContent";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";
import { useSidebarState } from "@/hooks/useSidebarState";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("agents");
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebarState();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Toaster position="top-right" />
      <SidebarWrapper
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      >
        <main className="flex-1 overflow-auto">
          <DashboardContent activeSection={activeSection} />
        </main>
      </SidebarWrapper>
    </div>
  );
};

export default Dashboard;
