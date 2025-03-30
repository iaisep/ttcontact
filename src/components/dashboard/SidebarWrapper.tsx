
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BookText,
  Phone,
  Upload,
  History,
  BarChart3,
  CreditCard,
  Key,
  Webhook,
  UserCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Bell,
  Rocket,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useApiContext } from "@/context/ApiContext";

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex h-screen w-full">
        <Sidebar variant="sidebar" className={`border-r transition-all duration-200 ${sidebarCollapsed ? "w-16" : "w-64"}`}>
          <SidebarHeader className="flex flex-col gap-2 px-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {sidebarCollapsed ? (
                  <div className="flex justify-center w-full">
                    <Home size={20} className="text-gray-500" />
                  </div>
                ) : (
                  <>
                    <Home size={20} className="text-gray-500" />
                    <h1 className="text-lg font-medium text-gray-700">UISEP_IA</h1>
                  </>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className={`h-8 w-8 absolute ${sidebarCollapsed ? "right-0 -mr-4" : "right-2"} top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full z-10 shadow-sm`}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
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
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator className="my-2" />
            <div className="px-2 py-2">
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
              
              {!sidebarCollapsed && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-semibold text-gray-700">Uso de la organización</div>
                  <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span>Créditos:</span>
                    <span>$0.00 restantes</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Agentes:</span>
                    <span>1 / 1 disponibles</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full w-full"></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span className="flex items-center">
                      <span className="inline-block mr-1 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                        i
                      </span>
                      Campañas:
                    </span>
                    <span>0 / 1 disponibles</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className="bg-gray-200 text-gray-600">A</AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-700">Alberto Sanchez</div>
                      <div className="text-xs text-gray-500 truncate">alberto.sanchez.pena@gmail.com</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className={`flex-1 transition-all duration-200 overflow-auto`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarWrapper;
