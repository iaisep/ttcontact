
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen w-full">
      <div 
        className={`border-r bg-white transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-[60px]' : 'w-[250px]'
        }`}
      >
        {/* Header */}
        <div className="border-b p-4">
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
              className="h-8 w-8 rounded-full bg-gray-100"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
          {!sidebarCollapsed && (
            <div className="mt-2 flex items-center justify-between">
              <select className="bg-background border border-input rounded px-2 py-1 text-xs w-full">
                <option>My Workspace</option>
                <option>Team Workspace</option>
                <option>Enterprise Workspace</option>
              </select>
            </div>
          )}
        </div>

        {/* Main Menu */}
        <div className="py-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-2.5 transition-colors ${
                    activeSection === item.id 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (!item.external) {
                      setActiveSection(item.id);
                    }
                  }}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  {!sidebarCollapsed && <span className="ml-3">{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t">
          {!sidebarCollapsed && (
            <div className="p-4">
              <div className="rounded-lg bg-gray-50 p-3 mb-3">
                <h3 className="font-medium text-sm mb-2">Organization Usage</h3>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Credits:</span>
                  <span>$0.00 remaining</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Agents:</span>
                  <span>1/1 available</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                  <div className="bg-red-500 h-1.5 rounded-full w-full"></div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-4 h-4 mr-1 flex items-center justify-center">
                    <div className="rounded-full w-3 h-3 flex items-center justify-center border border-gray-500">
                      <span className="text-[8px]">i</span>
                    </div>
                  </div>
                  <span>Campaigns:</span>
                  <span className="ml-auto">0/1 available</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">User Name</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="p-2 flex flex-col items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <HelpCircle size={20} />
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default SidebarWrapper;
