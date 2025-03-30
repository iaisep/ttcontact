
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
} from "lucide-react";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarCollapsed: boolean;
}

const SidebarMenu = ({ activeSection, setActiveSection, sidebarCollapsed }: SidebarMenuProps) => {
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
      title: t('batch_call'),
      id: "batch-call",
    },
    {
      icon: History,
      title: t('call_history'),
      id: "call-history",
    },
    {
      icon: BarChart3,
      title: t('analytics'),
      id: "analytics",
    },
    {
      icon: CreditCard,
      title: t('billing'),
      id: "billing",
    },
    {
      icon: Key,
      title: t('api_keys'),
      id: "api-keys",
    },
    {
      icon: Webhook,
      title: t('webhooks'),
      id: "webhooks",
    },
    {
      icon: UserCircle,
      title: t('account_info'),
      id: "account-info",
    },
    {
      icon: HelpCircle,
      title: t('help_center'),
      id: "help-center",
      external: true,
      url: "https://docs.retellai.com/",
    },
  ];

  return (
    <div className="py-2 flex-1 overflow-y-auto">
      <ul>
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
    </div>
  );
};

export default SidebarMenu;
