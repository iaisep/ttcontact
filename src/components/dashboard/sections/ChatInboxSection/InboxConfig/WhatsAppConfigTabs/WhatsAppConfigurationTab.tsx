
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { WhatsAppConfigData } from '../types';

interface WhatsAppConfigurationTabProps {
  configData: WhatsAppConfigData;
  updateConfigData: (field: keyof WhatsAppConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WhatsAppConfigurationTab: React.FC<WhatsAppConfigurationTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookToken, setShowWebhookToken] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Configuration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          WhatsApp API configuration settings
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="webhook-token">Webhook Verification Token</Label>
            <div className="mt-1 flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  id="webhook-token"
                  type={showWebhookToken ? 'text' : 'password'}
                  value={configData.webhookVerificationToken}
                  onChange={(e) => updateConfigData('webhookVerificationToken', e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowWebhookToken(!showWebhookToken)}
                  >
                    {showWebhookToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(configData.webhookVerificationToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Token used to verify webhook requests from WhatsApp
            </p>
          </div>

          <div>
            <Label htmlFor="api-key">API Key</Label>
            <div className="mt-1 flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={configData.apiKey}
                  onChange={(e) => updateConfigData('apiKey', e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(configData.apiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your WhatsApp Business API access token
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions</h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Create a WhatsApp Business App in Meta for Developers</li>
              <li>Generate an access token from the app dashboard</li>
              <li>Copy the access token to the API Key field above</li>
              <li>Set up webhook URL in your WhatsApp Business App</li>
              <li>Use the verification token above to verify your webhook</li>
            </ol>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Connected
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              WhatsApp Business API is configured
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfigurationTab;
