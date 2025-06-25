
import { useState, useEffect } from 'react';
import type { TelegramConfigData } from './TelegramConfigTypes';

export const useTelegramConfig = (inboxId: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState<TelegramConfigData>({
    // Settings
    inboxName: 'Maikelcontactbot',
    channelAvatar: '',
    enableChannelGreeting: false,
    greetingType: 'disabled',
    helpCenter: 'none',

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

    // Bot Configuration
    selectedBot: 'Agente_mensajeria_telegram_agente de ventas nuevo'
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

  const updateConfigData = (field: keyof TelegramConfigData, value: any) => {
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
      console.log('Telegram configuration saved:', configData);
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
