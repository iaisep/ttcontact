
import React from 'react';
import AgentsSection from './sections/AgentsSection';
import ChatAgentsSection from './sections/ChatAgentsSection';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
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
