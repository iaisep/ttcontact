
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Phone } from 'lucide-react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

import { useCallTransferForm } from './useCallTransferForm';
import FunctionMetaSection from './FunctionMetaSection';
import TransferMethodSection from './TransferMethodSection';
import TransferTypeSection from './TransferTypeSection';

interface CallTransferFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const CallTransferFunctionModal: React.FC<CallTransferFunctionModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { 
    formState, 
    setters,
    isSubmitting,
    handleSubmit 
  } = useCallTransferForm({ agent, onClose, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t('transfer_call')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FunctionMetaSection
            functionName={formState.functionName}
            setFunctionName={setters.setFunctionName}
            description={formState.description}
            setDescription={setters.setDescription}
          />
          
          <div className="space-y-2">
            <TransferMethodSection
              transferMethod={formState.transferMethod}
              setTransferMethod={setters.setTransferMethod}
              phoneNumber={formState.phoneNumber}
              setPhoneNumber={setters.setPhoneNumber}
              dynamicRouting={formState.dynamicRouting}
              setDynamicRouting={setters.setDynamicRouting}
            />
          </div>
          
          <TransferTypeSection
            transferType={formState.transferType}
            setTransferType={setters.setTransferType}
            messageType={formState.messageType}
            setMessageType={setters.setMessageType}
            handoffMessage={formState.handoffMessage}
            setHandoffMessage={setters.setHandoffMessage}
          />
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallTransferFunctionModal;
