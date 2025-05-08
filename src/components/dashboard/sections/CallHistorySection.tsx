
import React from 'react';
import CallHistorySectionComponent from './call-history/CallHistorySection';

// This is just a wrapper component to maintain backwards compatibility
const CallHistorySection: React.FC = () => {
  return <CallHistorySectionComponent />;
};

export default CallHistorySection;
