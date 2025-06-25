
import React from 'react';
import { useTelegramForm } from './TelegramInboxForm/useTelegramForm';
import StepsIndicator from './TelegramInboxForm/StepsIndicator';
import TelegramFormFields from './TelegramInboxForm/TelegramFormFields';
import AgentsSelectionStep from './TelegramInboxForm/AgentsSelectionStep';
import CompletionStep from './TelegramInboxForm/CompletionStep';
import type { TelegramInboxFormProps } from './TelegramInboxForm/types';

const TelegramInboxForm: React.FC<TelegramInboxFormProps> = ({ onBack, onComplete }) => {
  const {
    currentStep,
    setCurrentStep,
    isCreating,
    formData,
    selectedAgents,
    setSelectedAgents,
    errors,
    agents,
    handleInputChange,
    handleNextStep,
    handleCreateTelegramChannel
  } = useTelegramForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <TelegramFormFields
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
            agents={agents}
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
            onComplete={() => handleCreateTelegramChannel(onComplete)}
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

export default TelegramInboxForm;
