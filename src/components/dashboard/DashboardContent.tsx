
import React from 'react';
import AgentsSection from './sections/AgentsSection';
import ChatAgentsSection from './sections/ChatAgentsSection';
import ChatInboxSection from './sections/ChatInboxSection';
import AddInboxSection from './sections/AddInboxSection';
import KnowledgeBaseSection from './sections/knowledge-base/KnowledgeBaseSection';
import PhoneNumbersSection from './sections/PhoneNumbersSection';
import BatchCallSection from './sections/BatchCallSection';
import CallHistorySection from './sections/CallHistorySection';
import AnalyticsSection from './sections/AnalyticsSection';
import BillingSection from './sections/BillingSection';
import ApiKeysSection from './sections/api-keys/ApiKeysSection';
import WebhooksSection from './sections/WebhooksSection';
import AccountInfoSection from './sections/AccountInfoSection';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection, setActiveSection }) => {
  const handleInboxCreated = () => {
    // Navigate back to chat-inbox section after creating an inbox
    setActiveSection('chat-inbox');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'agents':
        return <AgentsSection />;
      case 'chat-agents':
        return <ChatAgentsSection />;
      case 'chat-inbox':
        return (
          <ChatInboxSection 
            onNavigateToAddInbox={() => setActiveSection('add-inbox')}
            onInboxCreated={handleInboxCreated}
          />
        );
      case 'add-inbox':
        return (
          <AddInboxSection 
            onBack={() => setActiveSection('chat-inbox')}
            onComplete={handleInboxCreated}
          />
        );
      case 'knowledge-base':
        return <KnowledgeBaseSection />;
      case 'phone-numbers':
        return <PhoneNumbersSection />;
      case 'batch-call':
        return <BatchCallSection />;
      case 'call-history':
        return <CallHistorySection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'billing':
        return <BillingSection />;
      case 'api-keys':
        return <ApiKeysSection />;
      case 'webhooks':
        return <WebhooksSection />;  
      case 'account-info':
        return <AccountInfoSection />;
      case 'help-center':
        return <div className="p-6"><h1 className="text-2xl font-bold">Help Center</h1></div>;
      case 'crm':
        return <div className="p-6"><h1 className="text-2xl font-bold">CRM</h1></div>;
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
