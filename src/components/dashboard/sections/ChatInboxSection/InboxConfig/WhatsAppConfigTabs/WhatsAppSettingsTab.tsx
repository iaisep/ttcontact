
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { WhatsAppConfigData } from '../types';

interface WhatsAppSettingsTabProps {
  configData: WhatsAppConfigData;
  updateConfigData: (field: keyof WhatsAppConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WhatsAppSettingsTab: React.FC<WhatsAppSettingsTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Inbox Settings</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Update your inbox settings
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="channel-avatar">Channel Avatar</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Seleccionar archivo
              </Button>
              <span className="text-sm text-gray-500">Ningún archivo seleccionado</span>
            </div>
          </div>

          <div>
            <Label htmlFor="inbox-name">Inbox Name</Label>
            <Input
              id="inbox-name"
              value={configData.inboxName}
              onChange={(e) => updateConfigData('inboxName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="api-provider">API Provider</Label>
            <Select value={configData.apiProvider} onValueChange={(value) => updateConfigData('apiProvider', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select API Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp Cloud">WhatsApp Cloud</SelectItem>
                <SelectItem value="WhatsApp Business">WhatsApp Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="channel-greeting">Enable channel greeting</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Auto-send greeting messages when customers start a conversation and send their first message.
              </p>
            </div>
            <Switch
              id="channel-greeting"
              checked={configData.enableChannelGreeting}
              onCheckedChange={(checked) => updateConfigData('enableChannelGreeting', checked)}
            />
          </div>

          <div>
            <Label htmlFor="help-center">Help Center</Label>
            <Select value={configData.helpCenter} onValueChange={(value) => updateConfigData('helpCenter', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Help Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Help Center</SelectItem>
                <SelectItem value="default">Default Help Center</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Attach a Help Center with the inbox
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="lock-conversation">Lock to single conversation</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable or disable multiple conversations for the same contact in this inbox
              </p>
            </div>
            <Switch
              id="lock-conversation"
              checked={configData.lockToSingleConversation}
              onCheckedChange={(checked) => updateConfigData('lockToSingleConversation', checked)}
            />
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

export default WhatsAppSettingsTab;
