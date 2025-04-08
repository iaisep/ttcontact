
import React from 'react';
import { cn } from '@/lib/utils';

interface PhoneNumber {
  id: string;
  number: string;
  friendly_name: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at: string;
}

interface PhoneNumbersListProps {
  phoneNumbers: PhoneNumber[];
  selectedPhoneId: string | null;
  onSelectPhone: (phone: PhoneNumber) => void;
}

const PhoneNumbersList: React.FC<PhoneNumbersListProps> = ({
  phoneNumbers,
  selectedPhoneId,
  onSelectPhone
}) => {
  return (
    <div className="border-r h-full min-h-[calc(100vh-180px)] w-[240px] flex-shrink-0">
      <div className="p-2">
        {phoneNumbers.map((phone) => (
          <div
            key={phone.id}
            className={cn(
              'px-3 py-2 rounded cursor-pointer text-sm',
              selectedPhoneId === phone.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted'
            )}
            onClick={() => onSelectPhone(phone)}
          >
            {phone.friendly_name}
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
