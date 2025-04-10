
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import ApiKeyRevealButton from './ApiKeyRevealButton';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateApiKey: (name: string) => Promise<string | null>;
}

const ApiKeyDialog = ({ isOpen, onOpenChange, onCreateApiKey }: ApiKeyDialogProps) => {
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showNewApiKey, setShowNewApiKey] = useState(false);

  const handleCreateApiKey = async () => {
    const createdKey = await onCreateApiKey(newApiKeyName);
    if (createdKey) {
      setNewApiKey(createdKey);
      setNewApiKeyName('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Create a new API key to authenticate with the Retell AI API.
          </DialogDescription>
        </DialogHeader>

        {newApiKey ? (
          <div className="space-y-4">
            <div className="rounded-md bg-amber-50 p-4 text-amber-700 border border-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Important: Save your API key</h3>
                  <div className="mt-2 text-sm">
                    <p>This is the only time your API key will be visible. Please save it in a secure location.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md relative">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-key" className="sr-only">API Key</Label>
                <div className="flex-1 font-mono text-sm break-all mr-8">
                  {showNewApiKey ? newApiKey : newApiKey!.replace(/(?<=^.{4}).*(?=.{4}$)/, '•'.repeat(newApiKey!.length - 8))}
                </div>
                <div className="absolute right-4 flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowNewApiKey(!showNewApiKey)}
                    title={showNewApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showNewApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyToClipboard(newApiKey!)}
                    title="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  setNewApiKey(null);
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Give your API key a descriptive name to identify its purpose.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateApiKey}>
                Create API Key
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
