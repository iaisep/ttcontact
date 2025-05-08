
import React from 'react';
// Importar directamente desde la carpeta call-history
import CallHistorySection from './call-history';

// Componente simple que reexporta el componente principal
const CallHistorySectionWrapper: React.FC = () => {
  return <CallHistorySection />;
};

export default CallHistorySectionWrapper;
