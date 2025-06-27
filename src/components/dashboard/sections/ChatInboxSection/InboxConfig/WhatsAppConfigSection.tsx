
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWhatsAppConfig } from './useWhatsAppConfig';
import WhatsAppSettingsTab from './WhatsAppConfigTabs/WhatsAppSettingsTab';
import WhatsAppCollaboratorsTab from './WhatsAppConfigTabs/WhatsAppCollaboratorsTab';
import WhatsAppBusinessHoursTab from './WhatsAppConfigTabs/WhatsAppBusinessHoursTab';
import WhatsAppCSATTab from './WhatsAppConfigTabs/WhatsAppCSATTab';
import WhatsAppConfigurationTab from './WhatsAppConfigTabs/WhatsAppConfigurationTab';
import WhatsAppBotConfigTab from './WhatsAppConfigTabs/WhatsAppBotConfigTab';
import type { InboxConfigSectionProps } from './types';

const WhatsAppConfigSection: React.FC<InboxConfigSectionProps> = ({ inboxId, onBack }) => {
  const {
    loading,
    saving,
    activeTab,
    setActiveTab,
    configData,
    updateConfigData,
    updateWeeklyHours,
    saveConfiguration
  } = useWhatsAppConfig(inboxId);

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
            <h1 className="text-2xl font-bold">isep_whatsapp_ (+521667696795)</h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
          <TabsTrigger value="csat">CSAT</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="bot-configuration">Bot Configuration</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="settings">
            <WhatsAppSettingsTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="collaborators">
            <WhatsAppCollaboratorsTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
              inboxId={parseInt(inboxId)}
            />
          </TabsContent>

          <TabsContent value="business-hours">
            <WhatsAppBusinessHoursTab
              configData={configData}
              updateConfigData={updateConfigData}
              updateWeeklyHours={updateWeeklyHours}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="csat">
            <WhatsAppCSATTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="configuration">
            <WhatsAppConfigurationTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>

          <TabsContent value="bot-configuration">
            <WhatsAppBotConfigTab
              configData={configData}
              updateConfigData={updateConfigData}
              saving={saving}
              onSave={saveConfiguration}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default WhatsAppConfigSection;
