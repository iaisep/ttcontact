
import { Button } from '@/components/ui/button';
import { Phone, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddPhoneNumber: () => void;
}

const EmptyState = ({ onAddPhoneNumber }: EmptyStateProps) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center text-center max-w-md">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Phone className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">You don't have any phone numbers</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Purchase a new phone number or connect to your existing number via SIP trunking.
        </p>
        <Button onClick={onAddPhoneNumber}>
          <Plus className="mr-2 h-4 w-4" />
          Add Phone Number
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
