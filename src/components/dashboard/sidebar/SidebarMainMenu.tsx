
import { 
  Home, Users, BookText, Phone, Upload, 
  BarChart3, Key, Webhook, UserCircle 
} from "lucide-react";
import { 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton 
} from "@/components/ui/sidebar";

interface SidebarMainMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
}

const SidebarMainMenu: React.FC<SidebarMainMenuProps> = ({ 
  activeSection, 
  setActiveSection, 
  sidebarCollapsed 
}) => {
  const menuItems = [
    {
      icon: Home,
      title: "Inicio",
      id: "home",
    },
    {
      icon: Users,
      title: "Agentes",
      id: "agents",
    },
    {
      icon: BookText,
      title: "Campañas",
      id: "campaigns",
    },
    {
      icon: Phone,
      title: "Llamadas",
      id: "calls",
    },
    {
      icon: Key,
      title: "Integraciones",
      id: "integrations",
    },
    {
      icon: Webhook,
      title: "Widgets",
      id: "widgets",
    },
    {
      icon: UserCircle,
      title: "Contactos",
      id: "contacts",
    },
    {
      icon: Upload,
      title: "Tareas",
      id: "tasks",
    },
    {
      icon: BarChart3,
      title: "Organizaciones",
      id: "organizations",
    }
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            isActive={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            tooltip={sidebarCollapsed ? item.title : undefined}
            className={`${activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon size={20} className={`min-w-[20px] ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            {!sidebarCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarMainMenu;
