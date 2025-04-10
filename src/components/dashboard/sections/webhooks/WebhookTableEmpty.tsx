
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Plus, Webhook } from 'lucide-react';

interface WebhookTableEmptyProps {
  onCreateWebhook: () => void;
}

export const WebhookTableEmpty = ({ onCreateWebhook }: WebhookTableEmptyProps) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <Webhook className="h-8 w-8 text-muted-foreground" />
          <p>No webhooks found</p>
          <Button variant="outline" size="sm" onClick={onCreateWebhook}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Webhook
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
