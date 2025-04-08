
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (sipUri: string, nickname: string) => Promise<void>;
}

const SipDialog = ({ open, onOpenChange, onConnect }: SipDialogProps) => {
  const [sipUri, setSipUri] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = async () => {
    setIsSubmitting(true);
    await onConnect(sipUri, nickname);
    setIsSubmitting(false);
    setSipUri('');
    setNickname('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Connect via SIP Trunking</DialogTitle>
          <DialogDescription>
            Connect your existing phone number using SIP trunking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="sip-uri" className="text-sm font-medium">SIP URI</label>
            <Input
              id="sip-uri"
              placeholder="sip:username@domain.com"
              value={sipUri}
              onChange={(e) => setSipUri(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sip-name" className="text-sm font-medium">Display Name</label>
            <Input
              id="sip-name"
              placeholder="My SIP Number"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SipDialog;
