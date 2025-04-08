
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';

interface OutboundCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromNumber: string;
}

const OutboundCallDialog: React.FC<OutboundCallDialogProps> = ({ 
  open, 
  onOpenChange,
  fromNumber,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWithAuth } = useApiContext();

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Making outbound call with:', {
        from_number: fromNumber,
        to_number: phoneNumber
      });
      
      await fetchWithAuth('/v2/create-phone-call', {
        method: 'POST',
        body: JSON.stringify({
          from_number: fromNumber,
          to_number: phoneNumber
        })
      });
      
      toast.success(`Making call to ${phoneNumber}`);
      onOpenChange(false);
      setPhoneNumber('');
    } catch (error) {
      console.error('Failed to make outbound call:', error);
      toast.error("Failed to make outbound call");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Outbound Call</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone-number" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone-number"
                placeholder="e.g. +11234567890"
                value={phoneNumber}
                onChange={handleNumberChange}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-black text-white"
          >
            {isLoading ? 'Calling...' : 'Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutboundCallDialog;
