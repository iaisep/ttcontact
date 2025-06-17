import React, { useState } from 'react';
import AgentsSection from './sections/AgentsSection';
import ChatAgentsSection from './sections/ChatAgentsSection';
import { useLanguage } from '@/context/LanguageContext';
import { Users, BookText, Phone, Upload, History, BarChart3, CreditCard, Key, Webhook, UserCircle, HelpCircle, ChevronLeft, Kanban, MessageCircle } from "lucide-react";

const DashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('agents');

  const renderContent = () => {
    switch (activeSection) {
      case 'agents':
        return <AgentsSection />;
      case 'chat-agents':
        return <ChatAgentsSection />;
      default:
        return <AgentsSection />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
