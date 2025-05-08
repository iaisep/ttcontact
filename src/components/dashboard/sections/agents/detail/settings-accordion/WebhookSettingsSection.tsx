
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const WebhookSettingsSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

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
            />
          </div>

          {/* Agent Level Webhook URL */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Agent Level Webhook URL</Label>
            <p className="text-xs text-gray-500">Webhook URL to receive events from Retell. (Learn more)</p>
            <Input 
              placeholder="Webhook URL"
              defaultValue="https://workflow.universidadisep.com/webhook/c27c"
              className="w-full text-sm"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default WebhookSettingsSection;
