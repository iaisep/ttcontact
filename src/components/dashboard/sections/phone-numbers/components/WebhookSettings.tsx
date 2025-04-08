
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebhookSettingsProps {
  webhookUrl: string;
  onUpdateWebhook: (webhookUrl: string | null) => Promise<boolean>;
}

const WebhookSettings = ({ webhookUrl, onUpdateWebhook }: WebhookSettingsProps) => {
  const [webhookEnabled, setWebhookEnabled] = useState<boolean>(!!webhookUrl);
  const [url, setUrl] = useState<string>(webhookUrl);

  // Update state when webhookUrl prop changes
  useEffect(() => {
    setWebhookEnabled(!!webhookUrl);
    setUrl(webhookUrl);
  }, [webhookUrl]);

  const handleWebhookChange = async (checked: boolean) => {
    setWebhookEnabled(checked);
    if (!checked) {
      await onUpdateWebhook(null);
      setUrl('');
    }
  };

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleWebhookSave = async () => {
    if (url) {
      await onUpdateWebhook(url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="webhook" 
            checked={webhookEnabled}
            onCheckedChange={handleWebhookChange}
          />
          <Label htmlFor="webhook" className="text-sm">
            Add an inbound webhook (Learn more)
          </Label>
        </div>
        
        {webhookEnabled && (
          <div className="flex items-center gap-2 mt-2">
            <Input 
              placeholder="https://your-webhook-url.com" 
              value={url}
              onChange={handleWebhookUrlChange}
              className="flex-1"
            />
            <Button size="sm" onClick={handleWebhookSave}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookSettings;
