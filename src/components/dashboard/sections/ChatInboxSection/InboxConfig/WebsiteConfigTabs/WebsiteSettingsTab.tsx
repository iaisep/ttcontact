
import React from 'react';
import { Button } from '@/components/ui/button';
import type { WebsiteConfigData } from '../WebsiteConfigTypes';
import ChannelAvatarSection from './components/ChannelAvatarSection';
import BasicSettingsSection from './components/BasicSettingsSection';
import ChannelGreetingSection from './components/ChannelGreetingSection';
import AdvancedSettingsSection from './components/AdvancedSettingsSection';
import FeaturesSection from './components/FeaturesSection';
import SenderNameSection from './components/SenderNameSection';

interface WebsiteSettingsTabProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
  updateFeature: (feature: keyof WebsiteConfigData['features'], value: boolean) => void;
  updateSenderName: (index: number, field: string, value: string) => void;
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
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Inbox Settings</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Update your inbox settings
        </p>

        <div className="space-y-6">
          <ChannelAvatarSection 
            configData={configData}
            updateConfigData={updateConfigData}
          />

          <BasicSettingsSection 
            configData={configData}
            updateConfigData={updateConfigData}
          />

          <ChannelGreetingSection 
            configData={configData}
            updateConfigData={updateConfigData}
          />

          <AdvancedSettingsSection 
            configData={configData}
            updateConfigData={updateConfigData}
          />

          <FeaturesSection 
            configData={configData}
            updateFeature={updateFeature}
          />

          <SenderNameSection 
            configData={configData}
            updateSenderName={updateSenderName}
          />
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
