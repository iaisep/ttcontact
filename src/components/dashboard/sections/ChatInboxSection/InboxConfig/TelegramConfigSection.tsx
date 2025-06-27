import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTelegramConfig } from './useTelegramConfig';
import TelegramSettingsTab from './TelegramConfigTabs/TelegramSettingsTab';
import TelegramCollaboratorsTab from './TelegramConfigTabs/TelegramCollaboratorsTab';
import TelegramBusinessHoursTab from './TelegramConfigTabs/TelegramBusinessHoursTab';
import TelegramCSATTab from './TelegramConfigTabs/TelegramCSATTab';
import TelegramBotConfigTab from './TelegramConfigTabs/TelegramBotConfigTab';
import type { TelegramConfigSectionProps } from './TelegramConfigTypes';

const TelegramConfigSection: React.FC<TelegramConfigSectionProps> = ({ inboxId, onBack }) => {
  const {
    loading,
    saving,
    activeTab,
    setActiveTab,
    configData,
    updateConfigData,
    updateWeeklyHours,
    saveConfiguration
  } = useTelegramConfig(inboxId);

  // Convert inboxId to number and validate it
  const numericInboxId = typeof inboxId === 'string' ? parseInt(inboxId) : inboxId;
  const validInboxId = !isNaN(numericInboxId) ? numericInboxId : undefined;

  console.log('TelegramConfigSection - inboxId processing:', { 
    original: inboxId, 
    parsed: numericInboxId,
    valid: validInboxId,
    isValid: !!validInboxId
  });

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
            <h1 className="text-2xl font-bold">Maikelcontactbot</h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
          <TabsTrigger value="csat">CSAT</TabsTrigger>
          <TabsTrigger value="bot-configuration">Bot Configuration</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="settings">
            <TelegramSettingsTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="collaborators">
            <TelegramCollaboratorsTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
              inboxId={validInboxId}
            />
          </TabsContent>

          <TabsContent value="business-hours">
            <TelegramBusinessHoursTab
              configData={configData}
              updateConfigData={updateConfigData}
              updateWeeklyHours={updateWeeklyHours}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="csat">
            <TelegramCSATTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="bot-configuration">
            <TelegramBotConfigTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
              inboxId={validInboxId}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TelegramConfigSection;
