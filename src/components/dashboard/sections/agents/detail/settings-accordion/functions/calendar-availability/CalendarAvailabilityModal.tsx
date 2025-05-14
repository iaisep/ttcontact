
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { AgentFunction } from '../types';
import { useCalendarAvailability } from './hooks/useCalendarAvailability';
import CalendarFormSection from './components/CalendarFormSection';
import ErrorAlert from './components/ErrorAlert';
import DialogFooterButtons from './components/DialogFooterButtons';

interface CalendarAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: RetellAgent;
  onSuccess?: () => void;
  initialData?: AgentFunction;
}

const CalendarAvailabilityModal: React.FC<CalendarAvailabilityModalProps> = ({ 
  isOpen, 
  onClose, 
  agent,
  onSuccess,
  initialData
}) => {
  const {
    isSubmitting,
    functionName,
    setFunctionName,
    description,
    setDescription,
    apiKey,
    setApiKey,
    eventTypeId,
    setEventTypeId,
    timezone,
    setTimezone,
    error,
    handleSubmit
  } = useCalendarAvailability({
    agent,
    onSuccess,
    onClose,
    initialData
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {initialData ? 'Edit Calendar Availability' : 'Check Calendar Availability (Cal.com)'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <ErrorAlert error={error} />
          
          <CalendarFormSection
            functionName={functionName}
            setFunctionName={setFunctionName}
            description={description}
            setDescription={setDescription}
            apiKey={apiKey}
            setApiKey={setApiKey}
            eventTypeId={eventTypeId}
            setEventTypeId={setEventTypeId}
            timezone={timezone}
            setTimezone={setTimezone}
          />
        </div>
        
        <DialogFooter>
          <DialogFooterButtons
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={!!initialData}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarAvailabilityModal;
