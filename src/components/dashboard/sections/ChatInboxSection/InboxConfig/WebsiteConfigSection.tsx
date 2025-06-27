
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebsiteConfig } from './useWebsiteConfig';
import WebsiteSettingsTab from './WebsiteConfigTabs/WebsiteSettingsTab';
import WebsitePreChatFormTab from './WebsiteConfigTabs/WebsitePreChatFormTab';
import WebsiteWidgetBuilderTab from './WebsiteConfigTabs/WebsiteWidgetBuilderTab';  
import WebsiteConfigurationTab from './WebsiteConfigTabs/WebsiteConfigurationTab';
import TelegramCollaboratorsTab from './TelegramConfigTabs/TelegramCollaboratorsTab';
import TelegramBusinessHoursTab from './TelegramConfigTabs/TelegramBusinessHoursTab';
import TelegramCSATTab from './TelegramConfigTabs/TelegramCSATTab';
import TelegramBotConfigTab from './TelegramConfigTabs/TelegramBotConfigTab';
import type { WebsiteConfigSectionProps } from './WebsiteConfigTypes';

const WebsiteConfigSection: React.FC<WebsiteConfigSectionProps> = ({ inboxId, onBack }) => {
  const {
    loading,
    saving,
    activeTab,
    setActiveTab,
    configData,
    updateConfigData,
    updateWeeklyHours,
    updatePreFormField,
    updateFeature,
    updateSenderName,
    saveConfiguration
  } = useWebsiteConfig(inboxId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{configData.websiteName}</h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
          <TabsTrigger value="csat">CSAT</TabsTrigger>
          <TabsTrigger value="pre-chat-form">Pre Chat Form</TabsTrigger>
          <TabsTrigger value="widget-builder">Widget Builder</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="bot-configuration">Bot Configuration</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="settings">
            <WebsiteSettingsTab
              configData={configData}
              updateConfigData={updateConfigData}
              updateFeature={updateFeature}
              updateSenderName={updateSenderName}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="collaborators">
            <TelegramCollaboratorsTab
              configData={configData as any}
              updateConfigData={updateConfigData as any}
              saving={saving}
              onSave={saveConfiguration}
              inboxId={parseInt(inboxId)}
            />
          </TabsContent>

          <TabsContent value="business-hours">
            <TelegramBusinessHoursTab
              configData={configData as any}
              updateConfigData={updateConfigData as any}
              updateWeeklyHours={updateWeeklyHours}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="csat">
            <TelegramCSATTab
              configData={configData as any}
              updateConfigData={updateConfigData as any}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="pre-chat-form">
            <WebsitePreChatFormTab
              configData={configData}
              updateConfigData={updateConfigData}
              updatePreFormField={updatePreFormField}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="widget-builder">
            <WebsiteWidgetBuilderTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="configuration">
            <WebsiteConfigurationTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="bot-configuration">
            <TelegramBotConfigTab
              configData={configData as any}
              updateConfigData={updateConfigData as any}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WebsiteConfigSection;
