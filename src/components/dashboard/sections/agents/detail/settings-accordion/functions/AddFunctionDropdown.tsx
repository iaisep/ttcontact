
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Phone, CornerDownRight, Calendar, FileText, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';

interface AddFunctionDropdownProps {
  onAddTemplate: (type: string) => void;
}

export const AddFunctionDropdown: React.FC<AddFunctionDropdownProps> = ({ onAddTemplate }) => {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <PlusCircle className="h-3 w-3 mr-1" /> Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onAddTemplate('end_call')}>
          <Phone className="mr-2 h-4 w-4" />
          <span>End Call</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddTemplate('call_transfer')}>
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
  );
};
