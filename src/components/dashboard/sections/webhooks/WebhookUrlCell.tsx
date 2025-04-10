
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X } from 'lucide-react';
import { Webhook } from './types';

interface WebhookUrlCellProps {
  webhook: Webhook;
  editingWebhookId: string | null;
  editingWebhookUrl: string;
  onEditingUrlChange: (url: string) => void;
  onStartEditing: (webhook: Webhook) => void;
  onSaveUrl: (id: string) => void;
  onCancelEditing: () => void;
}

export const WebhookUrlCell = ({
  webhook,
  editingWebhookId,
  editingWebhookUrl,
  onEditingUrlChange,
  onStartEditing,
  onSaveUrl,
  onCancelEditing
}: WebhookUrlCellProps) => {
  if (editingWebhookId === webhook.id) {
    return (
      <div className="flex items-center space-x-2">
        <Input 
          value={editingWebhookUrl}
          onChange={(e) => onEditingUrlChange(e.target.value)}
          className="text-xs flex-grow"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSaveUrl(webhook.id);
            } else if (e.key === 'Escape') {
              onCancelEditing();
            }
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onSaveUrl(webhook.id)}
          className="text-green-500 hover:text-green-700 hover:bg-green-100"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancelEditing}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <code className="text-xs bg-muted px-2 py-1 rounded whitespace-nowrap block overflow-hidden text-ellipsis">
        {webhook.url}
      </code>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onStartEditing(webhook)}
        className="flex-shrink-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
