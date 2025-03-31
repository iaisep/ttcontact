
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarToggle = ({
  sidebarCollapsed,
  toggleSidebar
}: SidebarToggleProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="h-8 w-8 p-0"
    >
      {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </Button>
  );
};

export default SidebarToggle;
