
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Phone } from 'lucide-react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

import { useEndCallForm } from './useEndCallForm';
import FunctionMetaSection from './FunctionMetaSection';

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
  const { t } = useLanguage();
  const { 
    formState, 
    setters, 
    isSubmitting,
    handleSubmit 
  } = useEndCallForm({ agent, onClose, onSuccess });

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t('end_call')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FunctionMetaSection
            name={formState.name}
            setName={setters.setName}
            description={formState.description}
            setDescription={setters.setDescription}
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

export default EndCallFunctionModal;
