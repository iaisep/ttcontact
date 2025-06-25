
import React from 'react';
import { useInboxFlow } from './AddInboxSection/useInboxFlow';
import ChannelSelection from './AddInboxSection/ChannelSelection';
import FormView from './AddInboxSection/FormView';
import type { AddInboxSectionProps } from './AddInboxSection/types';

const AddInboxSection: React.FC<AddInboxSectionProps> = ({ onBack, onComplete }) => {
  const {
    currentView,
    channels,
    handleChannelClick,
    handleBackToChannelSelection
  } = useInboxFlow();

  const handleFormComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'channel-selection' ? (
        <ChannelSelection
          channels={channels}
          onChannelClick={handleChannelClick}
          onBack={onBack}
        />
      ) : (
        <FormView
          currentView={currentView}
          onBack={handleBackToChannelSelection}
          onComplete={handleFormComplete}
        />
      )}
    </div>
  );
};

export default AddInboxSection;
