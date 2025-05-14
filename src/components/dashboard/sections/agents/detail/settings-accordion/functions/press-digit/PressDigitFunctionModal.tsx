
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { AgentFunction } from '../types';
import ErrorAlert from './components/ErrorAlert';
import FormFields from './components/FormFields';
import FooterButtons from './components/DialogFooter';
import usePressDigitForm from './hooks/usePressDigitForm';

interface PressDigitFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
  initialData?: AgentFunction;
}

const PressDigitFunctionModal: React.FC<PressDigitFunctionModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess,
  initialData
}) => {
  const {
    functionName,
    setFunctionName,
    description,
    setDescription,
    digit,
    setDigit,
    pauseDetectionDelay,
    setPauseDetectionDelay,
    error,
    isSubmitting,
    handleSubmit,
    isEditMode
  } = usePressDigitForm({
    agent,
    onClose,
    onSuccess,
    initialData
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Press Digit (IVR Navigation)
          </DialogTitle>
        </DialogHeader>
        
        <ErrorAlert error={error} />
        
        <FormFields
          functionName={functionName}
          setFunctionName={setFunctionName}
          description={description}
          setDescription={setDescription}
          digit={digit}
          setDigit={setDigit}
          pauseDetectionDelay={pauseDetectionDelay}
          setPauseDetectionDelay={setPauseDetectionDelay}
          isSubmitting={isSubmitting}
        />
        
        <FooterButtons
          onClose={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PressDigitFunctionModal;
