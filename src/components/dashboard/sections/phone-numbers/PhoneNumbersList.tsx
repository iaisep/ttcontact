
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { PhoneNumber } from './hooks/types';

interface PhoneNumbersListProps {
  phoneNumbers: PhoneNumber[];
  selectedPhoneId: string | null;
  onSelectPhone: (phone: PhoneNumber) => void;
  onAddClick: () => void;
  onBuyNewClick: () => void;
  onConnectSIPClick: () => void;
}

const PhoneNumbersList: React.FC<PhoneNumbersListProps> = ({
  phoneNumbers,
  selectedPhoneId,
  onSelectPhone,
  onAddClick,
  onBuyNewClick,
  onConnectSIPClick
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className="border-r h-full min-h-[calc(100vh-180px)] w-[280px] flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">Phone Numbers</h3>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onBuyNewClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Buy New Number</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onConnectSIPClick} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Connect to your number via SIP trunking</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2">
        {phoneNumbers.map((phone) => (
          <div
            key={phone.id}
            className={cn(
              'px-3 py-2 rounded cursor-pointer text-sm flex flex-col gap-1',
              selectedPhoneId === phone.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted'
            )}
            onClick={() => onSelectPhone(phone)}
          >
            <div className="font-medium truncate w-full">
              {phone.friendly_name || phone.nickname || 'Unnamed'}
            </div>
            <div className="text-xs text-muted-foreground">
              {phone.number}
            </div>
          </div>
        ))}
        
        {phoneNumbers.length === 0 && (
          <div className="text-center text-sm text-muted-foreground p-4">
            No phone numbers yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumbersList;
