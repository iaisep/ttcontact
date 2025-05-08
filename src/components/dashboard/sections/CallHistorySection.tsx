
import React from 'react';
import CallHistorySection from './call-history/CallHistorySection';

// This is just a wrapper component to maintain backwards compatibility
const CallHistorySectionWrapper: React.FC = () => {
  return <CallHistorySection />;
};

export default CallHistorySectionWrapper;
