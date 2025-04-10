
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { Webhook, EventOption } from './types';
import { WebhookUrlCell } from './WebhookUrlCell';

interface WebhookTableRowProps {
  webhook: Webhook;
  eventOptions: EventOption[];
  editingWebhookId: string | null;
  editingWebhookUrl: string;
  onEditingUrlChange: (url: string) => void;
  onStartEditing: (webhook: Webhook) => void;
  onSaveUrl: (id: string) => void;
  onCancelEditing: () => void;
  onTestWebhook: (id: string) => void;
  onToggleStatus: (id: string, status: 'active' | 'inactive') => void;
  onDeleteWebhook: (id: string) => void;
}

export const WebhookTableRow = ({
  webhook,
  eventOptions,
  editingWebhookId,
  editingWebhookUrl,
  onEditingUrlChange,
  onStartEditing,
  onSaveUrl,
  onCancelEditing,
  onTestWebhook,
  onToggleStatus,
  onDeleteWebhook
}: WebhookTableRowProps) => {
  return (
    <TableRow key={webhook.id}>
      <TableCell className="font-medium w-2/5">
        <WebhookUrlCell
          webhook={webhook}
          editingWebhookId={editingWebhookId}
          editingWebhookUrl={editingWebhookUrl}
          onEditingUrlChange={onEditingUrlChange}
          onStartEditing={onStartEditing}
          onSaveUrl={onSaveUrl}
          onCancelEditing={onCancelEditing}
        />
      </TableCell>
      <TableCell className="w-1/4">
        <div className="flex flex-wrap gap-1 whitespace-nowrap overflow-hidden">
          {webhook.events.map((eventId) => {
            const event = eventOptions.find(e => e.id === eventId);
            return (
              <span 
                key={eventId} 
                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full whitespace-nowrap"
                title={event?.description}
              >
                {event?.name || eventId}
              </span>
            );
          })}
        </div>
      </TableCell>
      <TableCell className="w-[10%]">
        <span 
          className={`px-2 py-1 rounded-full text-xs ${
            webhook.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
        </span>
      </TableCell>
      <TableCell className="w-[10%]">
        {new Date(webhook.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="w-[10%]">
        {webhook.last_triggered 
          ? new Date(webhook.last_triggered).toLocaleDateString() 
          : 'Never'}
      </TableCell>
      <TableCell className="text-right w-[15%]">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTestWebhook(webhook.id)}
          >
            Test
          </Button>
          <Button 
            variant={webhook.status === 'active' ? 'outline' : 'default'} 
            size="sm"
            onClick={() => onToggleStatus(webhook.id, webhook.status)}
          >
            {webhook.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this webhook? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => onDeleteWebhook(webhook.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};
