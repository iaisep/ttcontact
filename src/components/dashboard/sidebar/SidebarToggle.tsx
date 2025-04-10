
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  variant?: "default" | "outline" | "collapse";
  showLabel?: boolean;
  label?: string;
}

const SidebarToggle = ({
  sidebarCollapsed,
  toggleSidebar,
  variant = "collapse",
  showLabel = false,
  label = "Collapse"
}: SidebarToggleProps) => {
  return (
    <Button 
      variant={variant} 
      size={variant === "collapse" ? "icon" : "sm"}
      onClick={toggleSidebar} 
      className="flex items-center justify-center"
      title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {sidebarCollapsed ? 
        <ChevronRight className="h-4 w-4" /> : 
        <ChevronLeft className="h-4 w-4" />
      }
      {showLabel && !sidebarCollapsed && <span>{label}</span>}
    </Button>
  );
};

export default SidebarToggle;
