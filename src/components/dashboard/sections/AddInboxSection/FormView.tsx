
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WhatsAppInboxForm from '../ChatInboxSection/WhatsAppInboxForm';
import TelegramInboxForm from '../ChatInboxSection/TelegramInboxForm';
import type { InboxView } from './types';

interface FormViewProps {
  currentView: InboxView;
  onBack: () => void;
  onComplete: () => void;
}

const FormView: React.FC<FormViewProps> = ({
  currentView,
  onBack,
  onComplete
}) => {
  if (currentView === 'whatsapp-form') {
    return (
      <div className="p-6">
        <WhatsAppInboxForm 
          onBack={onBack}
          onComplete={onComplete}
        />
      </div>
    );
  }
  
  if (currentView === 'telegram-form') {
    return (
      <div className="p-6">
        <TelegramInboxForm 
          onBack={onBack}
          onComplete={onComplete}
        />
      </div>
    );
  }
  
  // Placeholder for other forms
  return (
    <div className="p-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Form Coming Soon</h3>
        <p className="text-gray-600 mb-4">This form is not implemented yet.</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Channel Selection
        </Button>
      </div>
    </div>
  );
};

export default FormView;
