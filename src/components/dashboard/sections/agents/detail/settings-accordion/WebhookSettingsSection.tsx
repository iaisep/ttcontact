
import React, { useState, useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { AccordionSectionProps } from './types';

const WebhookSettingsSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Initialize webhook URL from agent data when component mounts or agent changes
  useEffect(() => {
    if (agent && agent.webhook_url) {
      setWebhookUrl(agent.webhook_url);
    } else {
      // Default value if there's no webhook URL set
      setWebhookUrl("https://workflow.universidadisep.com/webhook/c27c");
    }
  }, [agent]);

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value);
  };

  const handleUpdateWebhook = async () => {
    if (!agent?.id) {
      toast.error(t('agent_id_missing'));
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await fetchWithAuth(`/update-agent/${agent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ webhook_url: webhookUrl })
      });

      if (response) {
        toast.success(t('webhook_updated_successfully') || 'Webhook updated successfully');
      }
    } catch (error) {
      console.error('Error updating webhook URL:', error);
      toast.error(t('webhook_update_error') || 'Failed to update webhook URL');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update webhook when input loses focus or Enter key is pressed
  const handleBlur = () => {
    handleUpdateWebhook();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateWebhook();
    }
  };

  return (
    <AccordionItem value="webhook-settings" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Webhook className="h-4 w-4 mr-2" />
        {t('webhook_settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Inbound Call Webhook URL */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Inbound Call Webhook URL</Label>
            <p className="text-xs text-gray-500">The webhook has been migrated to phone level webhooks. (Learn more)</p>
            <Input 
              placeholder="Webhook URL"
              className="w-full text-sm"
              disabled
            />
          </div>

          {/* Agent Level Webhook URL */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Agent Level Webhook URL</Label>
            <p className="text-xs text-gray-500">Webhook URL to receive events from Retell. (Learn more)</p>
            <Input 
              placeholder="Webhook URL"
              value={webhookUrl}
              onChange={handleWebhookChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-sm"
              disabled={isUpdating}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default WebhookSettingsSection;
