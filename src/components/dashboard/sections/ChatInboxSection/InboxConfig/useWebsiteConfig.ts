import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { WebsiteConfigData } from './WebsiteConfigTypes';

export const useWebsiteConfig = (inboxId: string) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  const [configData, setConfigData] = useState<WebsiteConfigData>({
    // Settings tab
    inboxName: '',
    channelAvatar: '',
    websiteName: '',
    websiteDomain: '',
    welcomeHeading: '',
    welcomeTagline: '',
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

  const fetchInboxData = async () => {
    try {
      setLoading(true);
      console.log('Fetching inbox data for ID:', inboxId);
      
      const response = await fetch(`https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`, {
        method: 'GET',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching inbox: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Inbox data fetched successfully:', result);
      
      // Map the API response to our config data structure
      const inboxData = result.payload || result;
      
      setConfigData(prev => ({
        ...prev,
        inboxName: inboxData.name || '',
        websiteName: inboxData.website_url || '',
        websiteDomain: inboxData.website_url || '',
        welcomeHeading: inboxData.welcome_title || 'Hi there!',
        welcomeTagline: inboxData.welcome_tagline || 'Welcome',
        widgetColor: inboxData.widget_color || '#00bcd4',
        enableChannelGreeting: inboxData.greeting_enabled || false,
        channelAvatar: inboxData.avatar_url || '',
        messengerScript: inboxData.web_widget_script || '',
      }));
      
      toast.success('Inbox configuration loaded successfully');
    } catch (error) {
      console.error('Error fetching inbox data:', error);
      toast.error('Failed to load inbox configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inboxId) {
      fetchInboxData();
    }
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
    
    try {
      const response = await fetch(`https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`, {
        method: 'PATCH',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: configData.inboxName,
          channel: {
            website_url: configData.websiteDomain,
            welcome_title: configData.welcomeHeading,
            welcome_tagline: configData.welcomeTagline,
            widget_color: configData.widgetColor,
          },
          greeting_enabled: configData.enableChannelGreeting,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating inbox: ${response.status}`);
      }

      toast.success('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
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
    updatePreFormField,
    updateFeature,
    updateSenderName,
    saveConfiguration
  };
};
