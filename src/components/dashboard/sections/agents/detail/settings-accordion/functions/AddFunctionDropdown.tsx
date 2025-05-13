
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Phone, CornerDownRight, Calendar, FileText, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';
import EndCallFunctionModal from './EndCallFunctionModal';
import CallTransferFunctionModal from './call-transfer';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AddFunctionDropdownProps {
  onAddTemplate: (type: string) => void;
  agent: RetellAgent;
  onFunctionAdded?: () => void;
}

export const AddFunctionDropdown: React.FC<AddFunctionDropdownProps> = ({ 
  onAddTemplate, 
  agent,
  onFunctionAdded
}) => {
  const { t } = useLanguage();
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [showCallTransferModal, setShowCallTransferModal] = useState(false);
  
  const handleEndCallClick = () => {
    setShowEndCallModal(true);
  };

  const handleCallTransferClick = () => {
    setShowCallTransferModal(true);
  };

  const handleFunctionAdded = () => {
    if (onFunctionAdded) {
      onFunctionAdded();
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <PlusCircle className="h-3 w-3 mr-1" /> Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleEndCallClick}>
            <Phone className="mr-2 h-4 w-4" />
            <span>End Call</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCallTransferClick}>
            <CornerDownRight className="mr-2 h-4 w-4" />
            <span>Call Transfer</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTemplate('calendar_check')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Check Calendar Availability</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTemplate('calendar_book')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Book on the Calendar</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTemplate('ivr_digit')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Press Digit (IVR Navigation)</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTemplate('custom')}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Custom Function</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEndCallModal && (
        <EndCallFunctionModal 
          isOpen={showEndCallModal} 
          onClose={() => setShowEndCallModal(false)} 
          agent={agent}
          onSuccess={handleFunctionAdded}
        />
      )}

      {showCallTransferModal && (
        <CallTransferFunctionModal
          isOpen={showCallTransferModal}
          onClose={() => setShowCallTransferModal(false)}
          agent={agent}
          onSuccess={handleFunctionAdded}
        />
      )}
    </>
  );
};
