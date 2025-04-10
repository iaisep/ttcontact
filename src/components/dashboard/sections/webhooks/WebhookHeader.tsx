
import { Button } from '@/components/ui/button';
import { Plus, Webhook } from 'lucide-react';
import { WebhookExport } from './WebhookExport';
import { Webhook as WebhookType } from './types';

interface WebhookHeaderProps {
  onCreateWebhook: () => void;
  webhooks: WebhookType[];
}

export const WebhookHeader = ({ onCreateWebhook, webhooks }: WebhookHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Webhooks</h1>
        <div className="flex items-center gap-2">
          <WebhookExport webhooks={webhooks} />
          <Button onClick={onCreateWebhook}>
            <Plus className="mr-2 h-4 w-4" />
            Create Webhook
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Webhooks</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Webhooks allow your application to receive real-time notifications about events that happen in your Retell AI account.
              Configure webhooks to integrate with your systems and automate workflows.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
