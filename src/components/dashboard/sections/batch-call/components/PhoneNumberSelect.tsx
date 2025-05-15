
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface PhoneNumberSelectProps {
  fetchingPhoneNumbers: boolean;
  phoneNumbers: any[];
  selectedPhoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onRefresh: () => void;
  phoneNumberError: string | null;
}

const PhoneNumberSelect = ({
  fetchingPhoneNumbers,
  phoneNumbers,
  selectedPhoneNumber,
  onPhoneNumberChange,
  onRefresh,
  phoneNumberError
}: PhoneNumberSelectProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-select">Select Phone Number with Agent</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={fetchingPhoneNumbers}
        >
          {fetchingPhoneNumbers ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <select
        id="agent-select"
        value={selectedPhoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        disabled={fetchingPhoneNumbers || phoneNumbers.length === 0}
      >
        {fetchingPhoneNumbers ? (
          <option value="">Loading...</option>
        ) : phoneNumbers.length === 0 ? (
          <option value="" disabled>No phone numbers available</option>
        ) : (
          <>
            <option value="">Select a phone number</option>
            {phoneNumbers.map((phone) => (
              <option key={phone.id || phone.phone_number} value={phone.phone_number}>
                {phone.phone_number_pretty || phone.phone_number} ({phone.nickname || phone.friendly_name})
              </option>
            ))}
          </>
        )}
      </select>
      
      {phoneNumberError && (
        <p className="text-xs text-destructive">{phoneNumberError}</p>
      )}
    </div>
  );
};

export default PhoneNumberSelect;
