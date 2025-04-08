
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: (areaCode: string) => Promise<boolean>;
}

const PurchaseDialog = ({ open, onOpenChange, onPurchase }: PurchaseDialogProps) => {
  const [areaCode, setAreaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePurchase = async () => {
    setIsSubmitting(true);
    const success = await onPurchase(areaCode);
    setIsSubmitting(false);
    if (success) {
      setAreaCode('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Purchase Phone Number</DialogTitle>
          <DialogDescription>
            Purchase a new phone number to use with your AI agents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="area-code" className="text-sm font-medium">Area Code</label>
            <Input
              id="area-code"
              placeholder="e.g., 415"
              maxLength={3}
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter a 3-digit area code to find available numbers in that region.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Search & Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
