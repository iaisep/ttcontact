
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEndCallForm } from './useEndCallForm';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import FunctionMetaSection from './FunctionMetaSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EndCallFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
}

const EndCallFunctionModal: React.FC<EndCallFunctionModalProps> = ({
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
  } = useEndCallForm({ agent, onClose, onSuccess });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add End Call Function</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <FunctionMetaSection
            name={formState.name}
            description={formState.description}
            setName={setters.setName}
            setDescription={setters.setDescription}
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

export default EndCallFunctionModal;
