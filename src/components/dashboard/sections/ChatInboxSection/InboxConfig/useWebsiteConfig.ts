
import { useState, useEffect } from 'react';
import type { WebsiteConfigData } from './WebsiteConfigTypes';

export const useWebsiteConfig = (inboxId: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  const [configData, setConfigData] = useState<WebsiteConfigData>({
    // Settings tab
    inboxName: 'https://totalcontact.com.mx/',
    channelAvatar: '',
    websiteName: 'https://totalcontact.com.mx/',
    websiteDomain: 'https://totalcontact.com.mx/',
    welcomeHeading: 'Hi there!',
    welcomeTagline: 'Welcome',
    widgetColor: '#00bcd4',
    enableChannelGreeting: false,
    setReplyTime: 'In a few minutes',
    enableEmailCollectBox: true,
    allowMessagesAfterResolved: true,
    enableConversationContinuity: true,
    helpCenter: 'none',
    features: {
      displayFilePicker: true,
      displayEmojiPicker: true,
      allowUsersToEndConversation: true,
      useInboxNameAndAvatar: false,
    },
    senderName: {
      type: 'friendly',
      friendlyName: 'Singh Chatwoot',
      professionalName: 'Chatwoot',
    },

    // Collaborators tab
    agents: ['Maikel Guzman'],
    enableAutoAssignment: true,
    autoAssignmentLimit: 2,

    // Business Hours tab
    enableBusinessAvailability: false,
    unavailableMessage: 'We are unavailable at the moment. Please leave a message and we\'ll get back to you.',
    timezone: 'Pacific Time (US & Canada) (GMT-07:00)',
    weeklyHours: {
      sunday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      monday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' }
    },

    // CSAT tab
    enableCSAT: false,
    displayType: 'emoji',
    csatMessage: 'Please enter a message to show users with the form',
    surveyRule: {
      condition: 'contains',
      labels: []
    },

    // Pre Chat Form tab
    enablePreChatForm: true,
    preChatMessage: 'Share your queries or comments here!',
    preFormFields: [
      {
        key: 'emailAddress',
        type: 'email',
        required: false,
        label: 'Email Id',
        placeholder: 'emailAddress',
        enabled: true
      },
      {
        key: 'fullName',
        type: 'text',
        required: false,
        label: 'Full name',
        placeholder: 'fullName',
        enabled: true
      },
      {
        key: 'phoneNumber',
        type: 'text',
        required: false,
        label: 'Phone number',
        placeholder: 'phoneNumber',
        enabled: true
      }
    ],

    // Widget Builder tab
    widgetBubblePosition: 'right',
    widgetBubbleType: 'standard',
    widgetBubbleLauncherTitle: 'Chat with us',

    // Configuration tab
    messengerScript: '',
    userIdentityValidation: 'DqxTNtvXhA4HShPxvfTQvCsC',
    enforceUserIdentityValidation: false,

    // Bot Configuration tab
    selectedBot: 'Agente_mensajeria_telegram_inmensa'
  });

  useEffect(() => {
    // Simulate loading configuration data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inboxId]);

  const updateConfigData = (field: keyof WebsiteConfigData, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const updatePreFormField = (index: number, field: any) => {
    setConfigData(prev => ({
      ...prev,
      preFormFields: prev.preFormFields.map((f, i) => 
        i === index ? { ...f, ...field } : f
      )
    }));
  };

  const updateFeature = (feature: keyof WebsiteConfigData['features'], value: boolean) => {
    setConfigData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  const updateSenderName = (field: keyof WebsiteConfigData['senderName'], value: any) => {
    setConfigData(prev => ({
      ...prev,
      senderName: {
        ...prev.senderName,
        [field]: value
      }
    }));
  };

  const saveConfiguration = async () => {
    setSaving(true);
    console.log('Saving Website configuration:', configData);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
  };

  return {
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
  };
};
