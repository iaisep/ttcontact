import React, { Suspense, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Import sections directly without lazy loading for the problematic component
import BillingSection from './sections/BillingSection';

// Lazy load other dashboard sections
const AgentsSection = React.lazy(() => import('./sections/AgentsSection'));
const KnowledgeBaseSection = React.lazy(() => import('./sections/knowledge-base'));
const PhoneNumbersSection = React.lazy(() => import('./sections/PhoneNumbersSection'));
const BatchCallSection = React.lazy(() => import('./sections/batch-call/BatchCallSection'));
const AnalyticsSection = React.lazy(() => import('./sections/analytics'));
const ApiKeysSection = React.lazy(() => import('./sections/api-keys'));
const WebhooksSection = React.lazy(() => import('./sections/WebhooksSection'));
const AccountInfoSection = React.lazy(() => import('./sections/AccountInfoSection'));
const CallHistorySection = React.lazy(() => import('./sections/CallHistorySection'));

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  // Add a refresh key to force re-render when needed
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a UI refresh
  const refreshUI = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Listen for custom event to refresh UI
  useEffect(() => {
    const handleRefreshEvent = () => {
      refreshUI();
    };

    window.addEventListener('refreshKnowledgeBase', handleRefreshEvent);
    return () => {
      window.removeEventListener('refreshKnowledgeBase', handleRefreshEvent);
    };
  }, []);

  // Function to render the appropriate section based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'agents':
        return <AgentsSection key={refreshKey} />;
      case 'knowledge-base':
        return <KnowledgeBaseSection key={refreshKey} />;
      case 'phone-numbers':
        return <PhoneNumbersSection key={refreshKey} />;
      case 'batch-call':
        return <BatchCallSection key={refreshKey} />;
      case 'analytics':
        return <AnalyticsSection key={refreshKey} />;
      case 'billing':
        // Use directly imported component instead of lazy-loaded one
        return <BillingSection key={refreshKey} />;
      case 'api-keys':
        return <ApiKeysSection key={refreshKey} />;
      case 'webhooks':
        return <WebhooksSection key={refreshKey} />;
      case 'account-info':
        return <AccountInfoSection key={refreshKey} />;
      case 'call-history':
        return <CallHistorySection key={refreshKey} />;
      default:
        return <AgentsSection key={refreshKey} />;
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
