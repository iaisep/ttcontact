
import { Bell, Rocket } from "lucide-react";
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";

interface SidebarFooterMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
}

const SidebarFooterMenu: React.FC<SidebarFooterMenuProps> = ({ 
  activeSection, 
  setActiveSection, 
  sidebarCollapsed 
}) => {
  const footerItems = [
    {
      icon: Bell,
      title: "Notificaciones",
      id: "notifications",
    },
    {
      icon: Rocket,
      title: "Academy",
      id: "academy",
      badge: "0%",
    }
  ];

  return (
    <>
      <SidebarSeparator className="my-2" />
      <SidebarMenu>
        {footerItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              tooltip={sidebarCollapsed ? item.title : undefined}
              className={`${activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <div className="flex items-center w-full">
                <item.icon size={20} className={`min-w-[20px] ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                {!sidebarCollapsed && (
                  <div className="flex justify-between items-center w-full">
                    <span className="ml-3 font-medium">{item.title}</span>
                    {item.badge && <span className="ml-auto text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
};

export default SidebarFooterMenu;
