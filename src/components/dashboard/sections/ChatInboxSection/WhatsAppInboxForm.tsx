
import React from 'react';
import { useWhatsAppForm } from './WhatsAppInboxForm/useWhatsAppForm';
import StepsIndicator from './WhatsAppInboxForm/StepsIndicator';
import WhatsAppFormFields from './WhatsAppInboxForm/WhatsAppFormFields';
import AgentsSelectionStep from './WhatsAppInboxForm/AgentsSelectionStep';
import CompletionStep from './WhatsAppInboxForm/CompletionStep';
import type { WhatsAppInboxFormProps } from './WhatsAppInboxForm/types';

const WhatsAppInboxForm: React.FC<WhatsAppInboxFormProps> = ({ onBack, onComplete }) => {
  const {
    currentStep,
    setCurrentStep,
    isCreating,
    formData,
    selectedAgents,
    setSelectedAgents,
    errors,
    handleInputChange,
    handleNextStep,
    handleCreateWhatsAppChannel
  } = useWhatsAppForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <WhatsAppFormFields
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onBack={onBack}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <AgentsSelectionStep
            selectedAgents={selectedAgents}
            onAgentSelect={setSelectedAgents}
            onBack={() => setCurrentStep(2)}
            onNext={handleNextStep}
          />
        );
      case 4:
        return (
          <CompletionStep
            formData={formData}
            selectedAgents={selectedAgents}
            isCreating={isCreating}
            onComplete={() => handleCreateWhatsAppChannel(onComplete)}
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

export default WhatsAppInboxForm;
