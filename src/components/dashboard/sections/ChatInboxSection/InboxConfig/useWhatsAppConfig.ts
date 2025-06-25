
import { useState, useEffect } from 'react';
import type { WhatsAppConfigData } from './types';

export const useWhatsAppConfig = (inboxId: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState<WhatsAppConfigData>({
    // Settings
    inboxName: 'isep_whatsapp_',
    channelAvatar: '',
    apiProvider: 'WhatsApp Cloud',
    enableChannelGreeting: false,
    helpCenter: 'none',
    lockToSingleConversation: false,

    // Collaborators
    agents: ['Maikel Guzman'],
    enableAutoAssignment: true,
    autoAssignmentLimit: 10,

    // Business Hours
    enableBusinessAvailability: true,
    unavailableMessage: '',
    timezone: 'Pacific Time (US & Canada) (GMT-07:00)',
    weeklyHours: {
      sunday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      monday: { enabled: true, allDay: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, allDay: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, allDay: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, allDay: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, allDay: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' }
    },

    // CSAT
    enableCSAT: false,
    displayType: 'emoji',
    csatMessage: 'Please enter a message to show users with the form',
    surveyRule: {
      condition: 'contains',
      labels: []
    },

    // Configuration
    webhookVerificationToken: '677731169e975dd29bd95b1100SeFfS',
    apiKey: 'EAA145E747ZBU803qaySpB0DzyTQQfxN6mrphqIo2bnikZcwZAquJNhYEoxTRuIcoCqyS1RrByizhdgBxZCCdGTBshrPGDQqJ02',

    // Bot Configuration
    selectedBot: 'Agente_mensajeria_telegram_inmensa'
  });

  useEffect(() => {
    // Simulate loading configuration data
    const loadConfig = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    
    loadConfig();
  }, [inboxId]);

  const updateConfigData = (field: keyof WhatsAppConfigData, value: any) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
  };

  const updateWeeklyHours = (day: string, hours: any) => {
    setConfigData(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [day]: hours
      }
    }));
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('WhatsApp configuration saved:', configData);
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    activeTab,
    setActiveTab,
    configData,
    updateConfigData,
    updateWeeklyHours,
    saveConfiguration
  };
};
