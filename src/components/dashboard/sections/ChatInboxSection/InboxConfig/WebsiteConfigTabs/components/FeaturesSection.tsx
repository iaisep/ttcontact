
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface FeaturesSectionProps {
  configData: WebsiteConfigData;
  updateFeature: (feature: keyof WebsiteConfigData['features'], value: boolean) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  configData,
  updateFeature
}) => {
  return (
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
  );
};

export default FeaturesSection;
