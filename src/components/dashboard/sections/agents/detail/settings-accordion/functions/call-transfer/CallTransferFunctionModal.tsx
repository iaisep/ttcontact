
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCallTransferForm } from './useCallTransferForm';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import FunctionMetaSection from './FunctionMetaSection';
import TransferMethodSection from './TransferMethodSection';
import TransferTypeSection from './TransferTypeSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const {
    formState,
    setters,
    isSubmitting,
    error,
    handleSubmit
  } = useCallTransferForm({ agent, onClose, onSuccess });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Call Transfer Function</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <FunctionMetaSection
            name={formState.functionName}
            description={formState.description}
            setName={setters.setFunctionName}
            setDescription={setters.setDescription}
          />
          
          <TransferMethodSection
            transferMethod={formState.transferMethod}
            phoneNumber={formState.phoneNumber}
            dynamicRouting={formState.dynamicRouting}
            setTransferMethod={setters.setTransferMethod}
            setPhoneNumber={setters.setPhoneNumber}
            setDynamicRouting={setters.setDynamicRouting}
          />
          
          <TransferTypeSection
            transferType={formState.transferType}
            messageType={formState.messageType}
            handoffMessage={formState.handoffMessage}
            setTransferType={setters.setTransferType}
            setMessageType={setters.setMessageType}
            setHandoffMessage={setters.setHandoffMessage}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-70' : ''}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallTransferFunctionModal;
