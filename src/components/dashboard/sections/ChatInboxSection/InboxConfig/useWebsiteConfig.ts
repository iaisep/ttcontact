import { useState, useEffect } from 'react';
import type { WebsiteConfigData } from './WebsiteConfigTypes';

export const useWebsiteConfig = (inboxId: string, inboxDetails?: any) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState<WebsiteConfigData>({
    // Settings
    websiteName: 'Website Chat',
    websiteUrl: 'https://example.com',
    websiteDomain: 'example.com',
    channelAvatar: '',
    enableChannelGreeting: false,
    greetingType: 'disabled',
    greetingMessage: '',
    helpCenter: 'none',

    // Additional widget settings
    welcomeHeading: 'Welcome to our website',
    welcomeTagline: 'How can we help you today?',
    setReplyTime: 'In a few minutes',
    enableEmailCollectBox: true,
    allowMessagesAfterResolved: true,
    enableConversationContinuity: true,

    // Features
    features: {
      enableFileUpload: true,
      enableConversationNoteEmail: true,
      enableCSATSubtitle: false,
      enableTypingIndicator: true,
      enableBusinessHours: true,
      enableCSAT: false,
      enablePreChatForm: false,
      enablePreChatMessage: false,
      enableReplyTime: true,
      enableConversationContinuity: true,
      enableContactInformation: true,
      enableEmailCollect: true,
      enablePhoneNumberCollect: true,
      enableFullNameCollect: true,
      displayFilePicker: true,
      displayEmojiPicker: true,
      allowUsersToEndConversation: false,
      useInboxNameAndAvatar: false,
    },

    // Pre Chat Form
    preChatFormEnabled: false,
    enablePreChatForm: false,
    preChatMessage: 'Please provide your contact details',
    requireEmail: true,
    requireFullName: true,
    requirePhoneNumber: false,
    preChatFormFields: [
      {
        key: 'fullName',
        name: 'fullName',
        placeholder: 'Full Name',
        type: 'text',
        required: true,
        enabled: true,
        field_type: 'standard',
        label: 'Full Name',
        values: []
      },
      {
        key: 'emailAddress',
        name: 'emailAddress',
        placeholder: 'Email Address',
        type: 'email',
        required: true,
        enabled: true,  
        field_type: 'standard',
        label: 'Email Address',
        values: []
      }
    ],

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

    // Widget Builder
    widgetColor: '#1f93ff',
    position: 'right',
    launcherTitle: 'Chat with us',
    widgetStyle: 'standard',
    widgetBubblePosition: 'right',
    widgetBubbleType: 'standard',
    widgetBubbleLauncherTitle: 'Chat with us',

    // Configuration
    userIdentityValidation: 'HzPShsUbLrckiXnUQzMSWr35',
    enforceUserIdentityValidation: false,

    // Sender Names
    senderNames: [
      { name: 'Support Team', email: 'support@example.com' }
    ],
    senderName: {
      type: 'friendly'
    },

    // Bot Configuration
    selectedBot: 'Agente_mensajeria_telegram_agente de ventas nuevo'
  });

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      
      console.log('useWebsiteConfig - Raw inboxDetails received:', inboxDetails);
      
      // Si tenemos datos de la API, usarlos para poblar el estado
      if (inboxDetails) {
        console.log('useWebsiteConfig - Processing inbox details:', {
          name: inboxDetails.name,
          website_url: inboxDetails.website_url,
          welcome_title: inboxDetails.welcome_title,
          welcome_tagline: inboxDetails.welcome_tagline,
          widget_color: inboxDetails.widget_color,
          greeting_enabled: inboxDetails.greeting_enabled,
          greeting_message: inboxDetails.greeting_message
        });
        
        const newConfigData = {
          // Settings - Direct API field mapping
          websiteName: inboxDetails.name || 'Website Chat',
          websiteUrl: inboxDetails.website_url || 'https://example.com',
          websiteDomain: inboxDetails.website_url ? 
            (() => {
              try {
                return new URL(inboxDetails.website_url).hostname;
              } catch {
                return inboxDetails.website_url.replace(/^https?:\/\//, '');
              }
            })() : 'example.com',
          channelAvatar: inboxDetails.avatar_url || '',
          enableChannelGreeting: Boolean(inboxDetails.greeting_enabled),
          greetingMessage: inboxDetails.greeting_message || '',
          
          // Widget settings - Check multiple possible API fields
          welcomeHeading: inboxDetails.welcome_title || inboxDetails.widget_config?.welcome_title || 'Welcome to our website',
          welcomeTagline: inboxDetails.welcome_tagline || inboxDetails.widget_config?.welcome_tagline || 'How can we help you today?',
          widgetColor: inboxDetails.widget_color || inboxDetails.color || '#1f93ff',
          launcherTitle: inboxDetails.welcome_title || 'Chat with us',
          widgetBubbleLauncherTitle: inboxDetails.welcome_title || 'Chat with us',

          // Keep existing values for other fields
          greetingType: inboxDetails.greeting_enabled ? 'enabled' : 'disabled',
          helpCenter: 'none',
          setReplyTime: 'In a few minutes',
          enableEmailCollectBox: true,
          allowMessagesAfterResolved: true,
          enableConversationContinuity: true,

          // Features
          features: {
            enableFileUpload: inboxDetails.enable_file_upload ?? true,
            enableConversationNoteEmail: true,
            enableCSATSubtitle: false,
            enableTypingIndicator: true,
            enableBusinessHours: inboxDetails.enable_business_hours ?? true,
            enableCSAT: inboxDetails.enable_csat ?? false,
            enablePreChatForm: inboxDetails.enable_pre_chat_form ?? false,
            enablePreChatMessage: false,
            enableReplyTime: true,
            enableConversationContinuity: true,
            enableContactInformation: true,
            enableEmailCollect: true,
            enablePhoneNumberCollect: true,
            enableFullNameCollect: true,
            displayFilePicker: true,
            displayEmojiPicker: true,
            allowUsersToEndConversation: false,
            useInboxNameAndAvatar: false,
          },

          // Keep existing values for complex objects
          preChatFormEnabled: false,
          enablePreChatForm: false,
          preChatMessage: 'Please provide your contact details',
          requireEmail: true,
          requireFullName: true,
          requirePhoneNumber: false,
          preChatFormFields: [
            {
              key: 'fullName',
              name: 'fullName',
              placeholder: 'Full Name',
              type: 'text',
              required: true,
              enabled: true,
              field_type: 'standard',
              label: 'Full Name',
              values: []
            },
            {
              key: 'emailAddress',
              name: 'emailAddress',
              placeholder: 'Email Address',
              type: 'email',
              required: true,
              enabled: true,  
              field_type: 'standard',
              label: 'Email Address',
              values: []
            }
          ],

          agents: ['Maikel Guzman'],
          enableAutoAssignment: true,
          autoAssignmentLimit: 10,

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

          enableCSAT: false,
          displayType: 'emoji' as const,
          csatMessage: 'Please enter a message to show users with the form',
          surveyRule: {
            condition: 'contains',
            labels: []
          },

          position: 'right' as const,
          widgetStyle: 'standard' as const,
          widgetBubblePosition: 'right' as const,
          widgetBubbleType: 'standard' as const,

          userIdentityValidation: 'HzPShsUbLrckiXnUQzMSWr35',
          enforceUserIdentityValidation: false,

          senderNames: [
            { name: 'Support Team', email: 'support@example.com' }
          ],
          senderName: {
            type: 'friendly' as const
          },

          selectedBot: 'Agente_mensajeria_telegram_agente de ventas nuevo'
        };

        console.log('useWebsiteConfig - Setting new config data:', newConfigData);
        setConfigData(newConfigData);
      }
      
      setLoading(false);
    };
    
    loadConfig();
  }, [inboxId, inboxDetails]);

  // Log current configData for debugging
  useEffect(() => {
    console.log('useWebsiteConfig - Current configData state:', {
      websiteName: configData.websiteName,
      websiteUrl: configData.websiteUrl,
      websiteDomain: configData.websiteDomain,
      welcomeHeading: configData.welcomeHeading,
      welcomeTagline: configData.welcomeTagline,
      widgetColor: configData.widgetColor
    });
  }, [configData]);

  const updateConfigData = (field: keyof WebsiteConfigData, value: any) => {
    console.log('useWebsiteConfig - Updating field:', field, 'with value:', value);
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

  const updatePreFormField = (index: number, field: any) => {
    setConfigData(prev => ({
      ...prev,
      preChatFormFields: prev.preChatFormFields.map((formField, i) =>
        i === index ? { ...formField, ...field } : formField
      )
    }));
  };

  const updateFeature = (field: string, value: boolean) => {
    setConfigData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
  };

  const updateSenderName = (field: string | symbol, value: any) => {
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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Website configuration saved:', configData);
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
    updatePreFormField,
    updateFeature,
    updateSenderName,
    saveConfiguration
  };
};
