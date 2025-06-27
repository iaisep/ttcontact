
import React from 'react';
import { useWebsiteForm } from './WebsiteInboxForm/useWebsiteForm';
import StepsIndicator from './TelegramInboxForm/StepsIndicator';
import WebsiteFormFields from './WebsiteInboxForm/WebsiteFormFields';
import AgentsSelectionStep from './TelegramInboxForm/AgentsSelectionStep';
import WebsiteCompletionStep from './WebsiteInboxForm/WebsiteCompletionStep';
import type { WebsiteInboxFormProps } from './WebsiteInboxForm/types';

const WebsiteInboxForm: React.FC<WebsiteInboxFormProps> = ({ onBack, onComplete }) => {
  const {
    currentStep,
    setCurrentStep,
    isCreating,
    loadingAgents,
    inboxCreated,
    formData,
    selectedAgents,
    setSelectedAgents,
    errors,
    agents,
    generatedScript,
    handleInputChange,
    handleNextStep,
    handleCreateWebsiteChannel
  } = useWebsiteForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <WebsiteFormFields
            formData={formData}
            errors={errors}
            isCreating={isCreating}
            onInputChange={handleInputChange}
            onBack={onBack}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <AgentsSelectionStep
            agents={agents}
            selectedAgents={selectedAgents}
            onAgentSelect={setSelectedAgents}
            onBack={inboxCreated ? undefined : () => setCurrentStep(2)} // Disable back if inbox was created
            onNext={handleNextStep}
            loading={loadingAgents}
          />
        );
      case 4:
        return (
          <WebsiteCompletionStep
            formData={formData}
            selectedAgents={selectedAgents}
            generatedScript={generatedScript}
            isCreating={isCreating}
            onComplete={() => handleCreateWebsiteChannel(onComplete)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StepsIndicator currentStep={currentStep} />
      {renderCurrentStep()}
    </div>
  );
};

export default WebsiteInboxForm;
