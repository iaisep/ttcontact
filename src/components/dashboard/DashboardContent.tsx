
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load all dashboard sections
const AgentsSection = React.lazy(() => import('./sections/AgentsSection'));
const KnowledgeBaseSection = React.lazy(() => import('./sections/KnowledgeBaseSection'));
const PhoneNumbersSection = React.lazy(() => import('./sections/PhoneNumbersSection'));
const BatchCallSection = React.lazy(() => import('./sections/BatchCallSection'));
const CallHistorySection = React.lazy(() => import('./sections/CallHistorySection'));
const AnalyticsSection = React.lazy(() => import('./sections/AnalyticsSection'));
const BillingSection = React.lazy(() => import('./sections/BillingSection'));
const ApiKeysSection = React.lazy(() => import('./sections/ApiKeysSection'));
const WebhooksSection = React.lazy(() => import('./sections/WebhooksSection'));
const AccountInfoSection = React.lazy(() => import('./sections/AccountInfoSection'));

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  // Function to render the appropriate section based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'agents':
        return <AgentsSection />;
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
      default:
        return <AgentsSection />;
    }
  };

  return (
    <div className="p-6 h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        {renderSection()}
      </Suspense>
    </div>
  );
};

export default DashboardContent;
