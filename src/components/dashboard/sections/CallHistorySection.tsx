
import React from 'react';
import CallHistorySectionContent from './call-history/CallHistorySection';

// Este es solo un componente contenedor para mantener la compatibilidad con versiones anteriores
const CallHistorySectionWrapper: React.FC = () => {
  return <CallHistorySectionContent />;
};

export default CallHistorySectionWrapper;
