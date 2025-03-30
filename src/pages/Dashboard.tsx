
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen,
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useApiContext } from "@/context/ApiContext";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("agents");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useApiContext();

  // Load sidebar state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
    {
      icon: Users,
      title: "Agents",
      id: "agents",
    },
    {
      icon: BookText,
      title: "Knowledge Base",
      id: "knowledge-base",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      id: "phone-numbers",
    },
    {
      icon: Upload,
      title: "Batch Call",
      id: "batch-call",
    },
    {
      icon: History,
      title: "Call History",
      id: "call-history",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      id: "analytics",
    },
    {
      icon: CreditCard,
      title: "Billing",
      id: "billing",
    },
    {
      icon: Key,
      title: "API Keys",
      id: "api-keys",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      id: "webhooks",
    },
    {
      icon: UserCircle,
      title: "Account Info",
      id: "account-info",
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      id: "help-center",
      external: true,
      url: "https://docs.retellai.com/",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Toaster position="top-right" />
      <SidebarProvider defaultOpen={!sidebarCollapsed}>
        <Sidebar variant="sidebar" className="border-r">
          <SidebarHeader className="flex flex-col gap-2 px-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>RA</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && <h1 className="text-lg font-semibold">UISEP_IA</h1>}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="h-8 w-8"
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between">
                <select className="bg-background border border-input rounded px-2 py-1 text-xs w-full">
                  <option>My Workspace</option>
                  <option>Team Workspace</option>
                  <option>Enterprise Workspace</option>
                </select>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              {!sidebarCollapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild={item.external}
                        isActive={activeSection === item.id}
                        onClick={() => {
                          if (!item.external) {
                            setActiveSection(item.id);
                          }
                        }}
                        tooltip={sidebarCollapsed ? item.title : undefined}
                      >
                        {item.external ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <item.icon size={18} className="min-w-[18px]" />
                            {!sidebarCollapsed && <span className="ml-2">{item.title}</span>}
                          </a>
                        ) : (
                          <button className="flex items-center w-full">
                            <item.icon size={18} className="min-w-[18px]" />
                            {!sidebarCollapsed && <span className="ml-2">{item.title}</span>}
                          </button>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator />
            <div className="px-3 py-2">
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Pro Plan</span>
                  <span>10/20 Parallel Calls</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold">User Name</span>
                    <span className="text-muted-foreground">user@example.com</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className={`${sidebarCollapsed ? 'ml-0' : 'ml-auto'} text-muted-foreground hover:text-foreground`}
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <DashboardContent activeSection={activeSection} />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
