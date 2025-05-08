
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Users, BookOpen, Phone, Clock, Activity, CreditCard } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  active: boolean;
}

interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      label: t('agents'),
      icon: <Users className="h-5 w-5" />,
      to: '/agentes',
      active: location.pathname.startsWith('/agentes'),
    },
    {
      label: t('knowledge_base'),
      icon: <BookOpen className="h-5 w-5" />,
      to: '/knowledge',
      active: location.pathname.startsWith('/knowledge'),
    },
    {
      label: t('phone_numbers'),
      icon: <Phone className="h-5 w-5" />,
      to: '/phones',
      active: location.pathname.startsWith('/phones'),
    },
    {
      label: t('call_history'),
      icon: <Clock className="h-5 w-5" />,
      to: '/calls',
      active: location.pathname.startsWith('/calls'),
    },
    {
      label: t('analytics'),
      icon: <Activity className="h-5 w-5" />,
      to: '/analytics',
      active: location.pathname.startsWith('/analytics'),
    },
    {
      label: t('billing'),
      icon: <CreditCard className="h-5 w-5" />,
      to: '/billing',
      active: location.pathname.startsWith('/billing'),
    },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center py-2 px-4 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          <span className="mr-3">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default SidebarNav;
