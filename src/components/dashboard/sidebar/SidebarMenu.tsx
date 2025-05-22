
import { useLanguage } from "@/context/LanguageContext";
import {
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
  ChevronLeft,
  Kanban,
} from "lucide-react";
import SidebarMenuItem from "./SidebarMenuItem";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SidebarMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed?: (collapsed: boolean) => void;
}

const SidebarMenu = ({ 
  activeSection, 
  setActiveSection, 
  sidebarCollapsed,
  setSidebarCollapsed 
}: SidebarMenuProps) => {
  const { t } = useLanguage();

  const menuItems = [
    {
      icon: Users,
      title: t('agents'),
      id: "agents",
    },
    {
      icon: BookText,
      title: t('knowledge_base'),
      id: "knowledge-base",
    },
    {
      icon: Phone,
      title: t('phone_numbers'),
      id: "phone-numbers",
    },
    {
      icon: Upload,
      title: t('Batch call'),
      id: "batch-call",
    },
    {
      icon: Kanban,
      title: t('CRM'),
      id: "crm",
      external: true,
      url: "/crm",
    },
    {
      icon: History,
      title: t('Call History'),
      id: "call-history",
    },
    {
      icon: BarChart3,
      title: t('Analytics'),
      id: "analytics",
    },
    {
      icon: CreditCard,
      title: t('Billing'),
      id: "billing",
    },
    {
      icon: Key,
      title: t('Api keys'),
      id: "api-keys",
    },
    {
      icon: Webhook,
      title: t('Webhooks'),
      id: "webhooks",
    },
    {
      icon: UserCircle,
      title: t('Account info'),
      id: "account-info",
    },
    {
      icon: HelpCircle,
      title: t('Help center'),
      id: "help-center",
      external: true,
      url: "/help-center",
    },
  ];

  const handleToggleSidebar = () => {
    if (setSidebarCollapsed) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="py-2 flex-1 overflow-y-auto flex flex-col">
      <ul className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            {...item}
            activeSection={activeSection}
            onSelect={setActiveSection}
            sidebarCollapsed={sidebarCollapsed}
          />
        ))}
      </ul>
      
      {/* Collapse/Expand Button */}
      {setSidebarCollapsed && (
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleToggleSidebar}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>{t('collapse')}</span>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
