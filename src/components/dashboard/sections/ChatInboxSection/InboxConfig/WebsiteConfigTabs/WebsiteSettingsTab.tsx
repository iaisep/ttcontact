import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { WebsiteConfigData } from '../WebsiteConfigTypes';

interface WebsiteSettingsTabProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
  updateFeature: (feature: keyof WebsiteConfigData['features'], value: boolean) => void;
  updateSenderName: (field: keyof WebsiteConfigData['senderName'], value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WebsiteSettingsTab: React.FC<WebsiteSettingsTabProps> = ({
  configData,
  updateConfigData,
  updateFeature,
  updateSenderName,
  saving,
  onSave
}) => {
  const [showBusinessNameConfig, setShowBusinessNameConfig] = useState(false);
  const [businessName, setBusinessName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('Selected file:', file);
      updateConfigData('channelAvatar', file.name);
    }
  };

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
            <div className="mt-1 flex items-center space-x-2">
              <Input
                id="channel-avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <span className="text-sm text-gray-500">
                {configData.channelAvatar ? `Selected: ${configData.channelAvatar}` : 'Ningun archivo seleccionado'}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="website-name">Website Name</Label>
            <Input
              id="website-name"
              value={configData.websiteName}
              onChange={(e) => updateConfigData('websiteName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="website-domain">Website Domain</Label>
            <Input
              id="website-domain"
              value={configData.websiteDomain}
              onChange={(e) => updateConfigData('websiteDomain', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="welcome-heading">Welcome Heading</Label>
            <Input
              id="welcome-heading"
              value={configData.welcomeHeading}
              onChange={(e) => updateConfigData('welcomeHeading', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="welcome-tagline">Welcome Tagline</Label>
            <Textarea
              id="welcome-tagline"
              value={configData.welcomeTagline}
              onChange={(e) => updateConfigData('welcomeTagline', e.target.value)}
              className="mt-1"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">0 / 255</p>
          </div>

          <div>
            <Label htmlFor="widget-color">Widget Color</Label>
            <div className="mt-1 flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: configData.widgetColor }}
              ></div>
              <Input
                id="widget-color"
                type="color"
                value={configData.widgetColor}
                onChange={(e) => updateConfigData('widgetColor', e.target.value)}
                className="w-20 h-8"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-channel-greeting">Enable channel greeting</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Auto-send greeting messages when customers start a conversation and send their first message.
              </p>
            </div>
            <Switch
              id="enable-channel-greeting"
              checked={configData.enableChannelGreeting}
              onCheckedChange={(checked) => updateConfigData('enableChannelGreeting', checked)}
            />
          </div>

          <div>
            <Label htmlFor="set-reply-time">Set Reply time</Label>
            <Select 
              value={configData.setReplyTime} 
              onValueChange={(value) => updateConfigData('setReplyTime', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In a few minutes">In a few minutes</SelectItem>
                <SelectItem value="In an hour">In an hour</SelectItem>
                <SelectItem value="In a few hours">In a few hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This reply time will be displayed on the live chat widget
            </p>
          </div>

          <div>
            <Label htmlFor="enable-email-collect">Enable email collect box</Label>
            <Select 
              value={configData.enableEmailCollectBox ? "Enabled" : "Disabled"} 
              onValueChange={(value) => updateConfigData('enableEmailCollectBox', value === "Enabled")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Enabled">Enabled</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enable or disable email collect box on new conversation
            </p>
          </div>

          <div>
            <Label htmlFor="allow-messages-after-resolved">Allow messages after conversation resolved</Label>
            <Select 
              value={configData.allowMessagesAfterResolved ? "Enabled" : "Disabled"} 
              onValueChange={(value) => updateConfigData('allowMessagesAfterResolved', value === "Enabled")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Enabled">Enabled</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Allow the end-users to send messages even after the conversation is resolved.
            </p>
          </div>

          <div>
            <Label htmlFor="enable-conversation-continuity">Enable conversation continuity via email</Label>
            <Select 
              value={configData.enableConversationContinuity ? "Enabled" : "Disabled"} 
              onValueChange={(value) => updateConfigData('enableConversationContinuity', value === "Enabled")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Enabled">Enabled</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Conversations will continue over email if the contact email address is available.
            </p>
          </div>

          <div>
            <Label htmlFor="help-center">Help Center</Label>
            <Select 
              value={configData.helpCenter} 
              onValueChange={(value) => updateConfigData('helpCenter', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Help Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select Help Center</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Attach a Help Center with the inbox
            </p>
          </div>

          <div>
            <Label>Features</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="display-file-picker"
                  checked={configData.features.displayFilePicker}
                  onCheckedChange={(checked) => updateFeature('displayFilePicker', !!checked)}
                />
                <Label htmlFor="display-file-picker">Display file picker on the widget</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="display-emoji-picker"
                  checked={configData.features.displayEmojiPicker}
                  onCheckedChange={(checked) => updateFeature('displayEmojiPicker', !!checked)}
                />
                <Label htmlFor="display-emoji-picker">Display emoji picker on the widget</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-users-end-conversation"
                  checked={configData.features.allowUsersToEndConversation}
                  onCheckedChange={(checked) => updateFeature('allowUsersToEndConversation', !!checked)}
                />
                <Label htmlFor="allow-users-end-conversation">Allow users to end conversation from the widget</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-inbox-name-avatar"
                  checked={configData.features.useInboxNameAndAvatar}
                  onCheckedChange={(checked) => updateFeature('useInboxNameAndAvatar', !!checked)}
                />
                <Label htmlFor="use-inbox-name-avatar">Use inbox name and avatar for the bot</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Sender name</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select the name of the agent who sent the reply to your customer when they receive emails from your agents.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    id="friendly"
                    name="senderType"
                    checked={configData.senderName.type === 'friendly'}
                    onChange={() => updateSenderName('type', 'friendly')}
                  />
                  <Label htmlFor="friendly">Friendly</Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Add the name of the agent who sent the reply in the sender name to make it friendly.
                </p>
                <div className="space-y-2">
                  <Label>For eg:</Label>
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <span className="text-blue-600">S</span> Singh Chatwoot<br />
                    &lt;support@yourbusiness.com&gt;
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    id="professional"
                    name="senderType"
                    checked={configData.senderName.type === 'professional'}
                    onChange={() => updateSenderName('type', 'professional')}
                  />
                  <Label htmlFor="professional">Professional</Label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Use only the configured business name as the sender name in the email header.
                </p>
                <div className="space-y-2">
                  <Label>For eg:</Label>
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <span className="text-blue-600">C</span> Chatwoot<br />
                    &lt;support@yourbusiness.com&gt;
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="link" 
                className="text-blue-600 p-0"
                onClick={() => setShowBusinessNameConfig(!showBusinessNameConfig)}
              >
                {showBusinessNameConfig ? '- Hide business name configuration' : '+ Configure your business name'}
              </Button>
            </div>
            
            {showBusinessNameConfig && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <div>
                  <Label htmlFor="business-name">Enter your business name</Label>
                  <Input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
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

export default WebsiteSettingsTab;
