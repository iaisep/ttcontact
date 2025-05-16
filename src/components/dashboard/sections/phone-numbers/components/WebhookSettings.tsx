
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface WebhookSettingsProps {
  webhookUrl: string;
  onUpdateWebhook: (webhookUrl: string | null) => Promise<boolean>;
}

const WebhookSettings = ({ webhookUrl, onUpdateWebhook }: WebhookSettingsProps) => {
  const [webhookEnabled, setWebhookEnabled] = useState<boolean>(!!webhookUrl);
  const [url, setUrl] = useState<string>(webhookUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update state when webhookUrl prop changes
  useEffect(() => {
    setWebhookEnabled(!!webhookUrl);
    setUrl(webhookUrl || '');
  }, [webhookUrl]);

  const handleWebhookChange = async (checked: boolean) => {
    setWebhookEnabled(checked);
    if (!checked) {
      setIsLoading(true);
      try {
        const success = await onUpdateWebhook(null);
        if (success) {
          setUrl('');
          toast.success('Webhook disabled successfully');
        } else {
          setWebhookEnabled(true); // Revert if failed
          toast.error('Failed to disable webhook');
        }
      } catch (error) {
        console.error('Error updating webhook:', error);
        toast.error('Failed to update webhook settings');
        setWebhookEnabled(true); // Revert if failed
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleWebhookBlur = async () => {
    if (!webhookEnabled || url === webhookUrl) {
      return; // Skip if webhook is disabled or URL hasn't changed
    }

    if (!url) {
      toast.error('Please enter a valid webhook URL');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onUpdateWebhook(url);
      if (success) {
        toast.success('Webhook URL updated successfully');
      } else {
        toast.error('Failed to update webhook URL');
      }
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast.error('Failed to save webhook URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="webhook"
            checked={webhookEnabled}
            onCheckedChange={(checked) => handleWebhookChange(checked === true)}
            disabled={isLoading}
          />
          <Label htmlFor="webhook" className="text-sm font-medium">
            Add an inbound webhook. {webhookEnabled ? '(Learn more)' : '(Learn more)'}
          </Label>
        </div>
        
        {webhookEnabled && (
          <div className="mt-2">
            <Input 
              placeholder="https://your-webhook-url.com" 
              value={url}
              onChange={handleWebhookUrlChange}
              onBlur={handleWebhookBlur}
              className="w-full"
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookSettings;
