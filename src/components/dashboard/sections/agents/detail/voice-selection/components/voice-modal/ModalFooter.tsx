
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useVoiceModal } from './VoiceModalContext';

interface ModalFooterProps {
  onClose: () => void;
  onSave: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, onSave }) => {
  const { t } = useLanguage();
  const { isLoading, isSaveEnabled } = useVoiceModal();
  
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={onClose} disabled={isLoading} className="h-8 px-3 text-sm">
        {t('cancel') || 'Cancel'}
      </Button>
      {isLoading ? (
        <Button disabled className="h-8 px-3 text-sm">
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          {t('saving') || 'Saving...'}
        </Button>
      ) : (
        <Button 
          onClick={onSave} 
          disabled={!isSaveEnabled}
          className="h-8 px-3 text-sm"
          variant="default"
        >
          <Save className="mr-2 h-3 w-3" />
          {t('save') || 'Save'}
        </Button>
      )}
    </div>
  );
};

export default ModalFooter;
