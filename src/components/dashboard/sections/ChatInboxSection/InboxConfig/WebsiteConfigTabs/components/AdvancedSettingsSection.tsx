
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface AdvancedSettingsSectionProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
  configData,
  updateConfigData
}) => {
  return (
    <>
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
    </>
  );
};

export default AdvancedSettingsSection;
