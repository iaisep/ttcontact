
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Webhook } from './types';

interface WebhookImportProps {
  onImportWebhooks: (webhooks: Webhook[]) => void;
}

export const WebhookImport = ({ onImportWebhooks }: WebhookImportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const webhooks = JSON.parse(content) as Webhook[];
        
        // Validate the imported data structure
        if (!Array.isArray(webhooks)) {
          throw new Error('Invalid format: Expected an array of webhooks');
        }

        // Check if webhooks have the required fields
        const isValidStructure = webhooks.every(webhook => 
          typeof webhook === 'object' && 
          webhook !== null &&
          typeof webhook.url === 'string' && 
          Array.isArray(webhook.events) &&
          (webhook.status === 'active' || webhook.status === 'inactive')
        );

        if (!isValidStructure) {
          throw new Error('Invalid webhook format');
        }

        // Assign new IDs to imported webhooks to prevent conflicts
        const importedWebhooks = webhooks.map(webhook => ({
          ...webhook,
          id: `imported_${Math.random().toString(36).substring(2, 11)}`,
          created_at: webhook.created_at || new Date().toISOString(),
        }));

        onImportWebhooks(importedWebhooks);
        toast.success(`Successfully imported ${importedWebhooks.length} webhooks`);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to import webhooks:', error);
        toast.error('Failed to import webhooks. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading the file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
        disabled={isLoading}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        disabled={isLoading}
        className="ml-2"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import JSON
      </Button>
    </>
  );
};
