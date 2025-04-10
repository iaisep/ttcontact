
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import { EventOption } from './types';

interface WebhookCreateDialogProps {
  open: boolean;
  eventOptions: EventOption[];
  onOpenChange: (open: boolean) => void;
  onCreateWebhook: (url: string, events: string[]) => Promise<boolean>;
}

export const WebhookCreateDialog = ({ 
  open, 
  eventOptions,
  onOpenChange,
  onCreateWebhook 
}: WebhookCreateDialogProps) => {
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const handleCreateWebhook = async () => {
    const success = await onCreateWebhook(newWebhookUrl, selectedEvents);
    if (success) {
      setNewWebhookUrl('');
      setSelectedEvents([]);
    }
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewWebhookUrl('');
      setSelectedEvents([]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Webhook</DialogTitle>
          <DialogDescription>
            Create a new webhook to receive event notifications.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Webhook URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL where we should send webhook events.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label>Select Events</Label>
            <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
              {eventOptions.map((event) => (
                <div key={event.id} className="flex items-center p-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.name}</div>
                    <div className="text-xs text-muted-foreground">{event.description}</div>
                  </div>
                  <div>
                    <Button
                      variant={selectedEvents.includes(event.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEventToggle(event.id)}
                    >
                      {selectedEvents.includes(event.id) ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : null}
                      {selectedEvents.includes(event.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Select which events should trigger this webhook.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateWebhook}>
            Create Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
