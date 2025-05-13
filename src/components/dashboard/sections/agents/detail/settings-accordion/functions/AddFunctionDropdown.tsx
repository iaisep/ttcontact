
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusIcon } from 'lucide-react';
import { createFunctionFromTemplate } from './functionUtils';
import { RetellAgent } from '../../../types/retell-types'; 
import AddFunctionModal from '../function-modals/AddFunctionModal';
import EndCallFunctionModal from './end-call';
import CallTransferFunctionModal from './call-transfer';
import BookCalendarModal from './book-calendar';
import CalendarAvailabilityModal from './calendar-availability';
import PressDigitFunctionModal from './press-digit';
import { AgentFunction } from './types';

interface AddFunctionDropdownProps {
  agent: RetellAgent;
  onAddFunction?: (newFunction: AgentFunction) => void;
  refreshFunctions?: () => void;
}

const AddFunctionDropdown: React.FC<AddFunctionDropdownProps> = ({
  agent,
  onAddFunction,
  refreshFunctions,
}) => {
  const [functionType, setFunctionType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [showTransferCallModal, setShowTransferCallModal] = useState(false);
  const [showBookCalendarModal, setShowBookCalendarModal] = useState(false);
  const [showCalendarAvailabilityModal, setShowCalendarAvailabilityModal] = useState(false);
  const [showPressDigitModal, setShowPressDigitModal] = useState(false);

  const handleSelectType = (type: string) => {
    setFunctionType(type);
    
    if (type === 'end_call') {
      setShowEndCallModal(true);
    } else if (type === 'transfer_call') {
      setShowTransferCallModal(true);
    } else if (type === 'calendar_book') {
      setShowBookCalendarModal(true);
    } else if (type === 'calendar_availability') {
      setShowCalendarAvailabilityModal(true);
    } else if (type === 'ivr_digit') {
      setShowPressDigitModal(true);
    } else {
      // For custom functions
      setShowAddModal(true);
    }
  };

  const handleAddFunction = (newFunction: AgentFunction) => {
    if (onAddFunction) {
      onAddFunction(newFunction);
    }
    
    if (refreshFunctions) {
      refreshFunctions();
    }
    
    // Close modals and reset state
    setShowAddModal(false);
    setShowEndCallModal(false);
    setShowTransferCallModal(false);
    setShowBookCalendarModal(false);
    setShowCalendarAvailabilityModal(false);
    setShowPressDigitModal(false);
    setFunctionType(null);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setShowEndCallModal(false);
    setShowTransferCallModal(false);
    setShowBookCalendarModal(false);
    setShowCalendarAvailabilityModal(false);
    setShowPressDigitModal(false);
    setFunctionType(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="h-8">
            <PlusIcon className="h-4 w-4 mr-1" /> Add Function
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleSelectType('custom')}>
              Custom Function
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectType('end_call')}>
              End Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectType('transfer_call')}>
              Transfer Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectType('ivr_digit')}>
              Press Digit (IVR Navigation)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectType('calendar_book')}>
              Book on the Calendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectType('calendar_availability')}>
              Check Calendar Availability
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Function Modal */}
      <AddFunctionModal
        isOpen={showAddModal}
        onClose={handleClose}
        onAdd={handleAddFunction}
        functionData={functionType ? createFunctionFromTemplate(functionType) : null}
      />

      {/* End Call Modal */}
      <EndCallFunctionModal
        isOpen={showEndCallModal}
        onClose={handleClose}
        agent={agent}
        onSuccess={refreshFunctions}
      />

      {/* Transfer Call Modal */}
      <CallTransferFunctionModal
        isOpen={showTransferCallModal}
        onClose={handleClose}
        agent={agent}
        onSuccess={refreshFunctions}
      />

      {/* Book Calendar Modal */}
      <BookCalendarModal
        isOpen={showBookCalendarModal}
        onClose={handleClose}
        agent={agent}
        onSuccess={refreshFunctions}
      />

      {/* Calendar Availability Modal */}
      <CalendarAvailabilityModal
        isOpen={showCalendarAvailabilityModal}
        onClose={handleClose}
        agent={agent}
        onSuccess={refreshFunctions}
      />

      {/* Press Digit Modal */}
      <PressDigitFunctionModal
        isOpen={showPressDigitModal}
        onClose={handleClose}
        agent={agent}
        onSuccess={refreshFunctions}
      />
    </>
  );
};

export default AddFunctionDropdown;
