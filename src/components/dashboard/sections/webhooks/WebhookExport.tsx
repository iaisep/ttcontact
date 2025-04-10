
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Webhook } from './types';
import { toast } from 'sonner';

interface WebhookExportProps {
  webhooks: Webhook[];
}

export const WebhookExport = ({ webhooks }: WebhookExportProps) => {
  const handleExport = () => {
    try {
      // Convert the webhooks array to a formatted JSON string
      const webhooksData = JSON.stringify(webhooks, null, 2);
      
      // Create a blob with the JSON data
      const blob = new Blob([webhooksData], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `webhooks-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Webhooks exported successfully');
    } catch (error) {
      console.error('Failed to export webhooks:', error);
      toast.error('Failed to export webhooks');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={webhooks.length === 0}
      className="ml-2"
    >
      <Download className="mr-2 h-4 w-4" />
      Export JSON
    </Button>
  );
};
