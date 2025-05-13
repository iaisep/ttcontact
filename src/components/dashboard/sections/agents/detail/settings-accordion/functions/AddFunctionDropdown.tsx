
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddFunctionDropdownProps } from './types';
import PressDigitFunctionModal from './press-digit/PressDigitFunctionModal';
import EndCallFunctionModal from './end-call/EndCallFunctionModal';
import CallTransferFunctionModal from './call-transfer/CallTransferFunctionModal';
import BookCalendarModal from './book-calendar/BookCalendarModal';
import CalendarAvailabilityModal from './calendar-availability/CalendarAvailabilityModal';

const AddFunctionDropdown: React.FC<AddFunctionDropdownProps> = ({ 
  onAddTemplate, 
  agent, 
  onFunctionAdded 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [showTransferCallModal, setShowTransferCallModal] = useState(false);
  const [showPressDigitModal, setShowPressDigitModal] = useState(false);
  const [showBookCalendarModal, setShowBookCalendarModal] = useState(false);
  const [showCalendarAvailabilityModal, setShowCalendarAvailabilityModal] = useState(false);

  const handleEndCallSuccess = () => {
    setShowEndCallModal(false);
    if (onFunctionAdded) onFunctionAdded();
  };

  const handleTransferCallSuccess = () => {
    setShowTransferCallModal(false);
    if (onFunctionAdded) onFunctionAdded();
  };

  const handlePressDigitSuccess = () => {
    setShowPressDigitModal(false);
    if (onFunctionAdded) onFunctionAdded();
  };

  const handleBookCalendarSuccess = () => {
    setShowBookCalendarModal(false);
    if (onFunctionAdded) onFunctionAdded();
  };

  const handleCalendarAvailabilitySuccess = () => {
    setShowCalendarAvailabilityModal(false);
    if (onFunctionAdded) onFunctionAdded();
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Function
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            onAddTemplate('custom');
          }}>
            Custom Function
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            setShowEndCallModal(true);
          }}>
            End Call
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            setShowTransferCallModal(true);
          }}>
            Transfer Call
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            setShowPressDigitModal(true);
          }}>
            Press Digit (IVR)
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            setShowBookCalendarModal(true);
          }}>
            Book Calendar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            setIsOpen(false);
            setShowCalendarAvailabilityModal(true);
          }}>
            Calendar Availability
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Function specific modals */}
      {showEndCallModal && (
        <EndCallFunctionModal
          isOpen={showEndCallModal}
          onClose={() => setShowEndCallModal(false)}
          agent={agent}
          onSuccess={handleEndCallSuccess}
        />
      )}

      {showTransferCallModal && (
        <CallTransferFunctionModal
          isOpen={showTransferCallModal}
          onClose={() => setShowTransferCallModal(false)}
          agent={agent}
          onSuccess={handleTransferCallSuccess}
        />
      )}

      {showPressDigitModal && (
        <PressDigitFunctionModal
          isOpen={showPressDigitModal}
          onClose={() => setShowPressDigitModal(false)}
          agent={agent}
          onSuccess={handlePressDigitSuccess}
        />
      )}

      {showBookCalendarModal && (
        <BookCalendarModal
          isOpen={showBookCalendarModal}
          onClose={() => setShowBookCalendarModal(false)}
          agent={agent}
          onSuccess={handleBookCalendarSuccess}
        />
      )}

      {showCalendarAvailabilityModal && (
        <CalendarAvailabilityModal
          isOpen={showCalendarAvailabilityModal}
          onClose={() => setShowCalendarAvailabilityModal(false)}
          agent={agent}
          onSuccess={handleCalendarAvailabilitySuccess}
        />
      )}
    </>
  );
};

export default AddFunctionDropdown;
