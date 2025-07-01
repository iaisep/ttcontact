
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInboxContext } from '@/context/InboxContext';
import type { WebsiteConfigData } from './WebsiteConfigTypes';

export const useWebsiteConfig = (inboxId: string, inboxDetails?: any) => {
  const inboxContext = useInboxContext();
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState<WebsiteConfigData>({
    websiteName: 'Website Chat',
    websiteUrl: 'https://example.com',
    websiteDomain: 'example.com',
    channelAvatar: '',
    enableChannelGreeting: false,
    greetingType: 'disabled',
    greetingMessage: '',
    helpCenter: 'none',
    welcomeHeading: 'Welcome to our website',
    welcomeTagline: 'How can we help you today?',
    setReplyTime: 'In a few minutes',
    enableEmailCollectBox: true,
    allowMessagesAfterResolved: true,
    enableConversationContinuity: true,
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
    displayType: 'emoji',
    csatMessage: 'Please enter a message to show users with the form',
    surveyRule: {
      condition: 'contains',
      labels: []
    },
    widgetColor: '#1f93ff',
    position: 'right',
    launcherTitle: 'Chat with us',
    widgetStyle: 'standard',
    widgetBubblePosition: 'right',
    widgetBubbleType: 'standard',
    widgetBubbleLauncherTitle: 'Chat with us',
    userIdentityValidation: 'HzPShsUbLrckiXnUQzMSWr35',
    enforceUserIdentityValidation: false,
    senderNames: [
      { name: 'Support Team', email: 'support@example.com' }
    ],
    senderName: {
      type: 'friendly'
    },
    selectedBot: 'Agente_mensajeria_telegram_agente de ventas nuevo'
  });

  // Ref to track if we've already loaded data for this inbox
  const loadedInboxRef = useRef<string | null>(null);
  const isInitialized = useRef(false);

  // Transform inbox details to config data
  const transformInboxDetailsToConfig = useCallback((details: any): WebsiteConfigData => {
    if (!details) return configData;

    console.log('useWebsiteConfig - Transforming inbox details:', {
      name: details.name,
      website_url: details.website_url,
      welcome_title: details.welcome_title,
      welcome_tagline: details.welcome_tagline,
      widget_color: details.widget_color,
      greeting_enabled: details.greeting_enabled,
      greeting_message: details.greeting_message
    });
    
    return {
      websiteName: details.name || 'Website Chat',
      websiteUrl: details.website_url || 'https://example.com',
      websiteDomain: details.website_url ? 
        (() => {
          try {
            return new URL(details.website_url).hostname;
          } catch {
            return details.website_url.replace(/^https?:\/\//, '');
          }
        })() : 'example.com',
      channelAvatar: details.avatar_url || '',
      enableChannelGreeting: Boolean(details.greeting_enabled),
      greetingMessage: details.greeting_message || '',
      welcomeHeading: details.welcome_title || details.widget_config?.welcome_title || 'Welcome to our website',
      welcomeTagline: details.welcome_tagline || details.widget_config?.welcome_tagline || 'How can we help you today?',
      widgetColor: details.widget_color || details.color || '#1f93ff',
      launcherTitle: details.welcome_title || 'Chat with us',
      widgetBubbleLauncherTitle: details.welcome_title || 'Chat with us',
      greetingType: details.greeting_enabled ? 'custom' : 'disabled',
      helpCenter: 'none',
      setReplyTime: 'In a few minutes',
      enableEmailCollectBox: true,
      allowMessagesAfterResolved: true,
      enableConversationContinuity: true,
      features: {
        enableFileUpload: details.enable_file_upload ?? true,
        enableConversationNoteEmail: true,
        enableCSATSubtitle: false,
        enableTypingIndicator: true,
        enableBusinessHours: details.enable_business_hours ?? true,
        enableCSAT: details.enable_csat ?? false,
        enablePreChatForm: details.enable_pre_chat_form ?? false,
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
  }, [configData]);

  // Single effect to handle data loading
  useEffect(() => {
    const loadConfig = async () => {
      // Avoid duplicate loading for the same inbox
      if (loadedInboxRef.current === inboxId && isInitialized.current) {
        console.log('useWebsiteConfig - Skipping duplicate load for inbox:', inboxId);
        return;
      }

      console.log('useWebsiteConfig - Loading config for inbox:', inboxId);
      
      try {
        let details = inboxDetails;
        
        // Only load from API if we don't have details and haven't loaded from context
        if (!details && inboxId && inboxId !== loadedInboxRef.current) {
          // Check if we already have details in context
          if (inboxContext.inboxDetails && inboxContext.inboxDetails.id === parseInt(inboxId)) {
            details = inboxContext.inboxDetails;
          } else {
            // Load from API as last resort
            await inboxContext.loadInboxDetails(parseInt(inboxId));
            details = inboxContext.inboxDetails;
          }
        }
        
        if (details) {
          const newConfigData = transformInboxDetailsToConfig(details);
          console.log('useWebsiteConfig - Setting new config data:', newConfigData);
          setConfigData(newConfigData);
          
          // Mark this inbox as loaded
          loadedInboxRef.current = inboxId;
          isInitialized.current = true;
        }
      } catch (error) {
        console.error('useWebsiteConfig - Error loading config:', error);
      }
    };
    
    // Only load if we have an inboxId and haven't loaded it yet
    if (inboxId && (loadedInboxRef.current !== inboxId || !isInitialized.current)) {
      loadConfig();
    }
  }, [inboxId, inboxDetails, inboxContext.inboxDetails, transformInboxDetailsToConfig]);

  // Sync with context updates
  useEffect(() => {
    if (inboxContext.inboxDetails && inboxContext.inboxDetails.id === parseInt(inboxId)) {
      const newConfigData = transformInboxDetailsToConfig(inboxContext.inboxDetails);
      setConfigData(newConfigData);
      console.log('useWebsiteConfig - Synced with context updates');
    }
  }, [inboxContext.inboxDetails, inboxId, transformInboxDetailsToConfig]);

  // Reset when inbox changes
  useEffect(() => {
    if (loadedInboxRef.current && loadedInboxRef.current !== inboxId) {
      console.log('useWebsiteConfig - Inbox changed, resetting state');
      loadedInboxRef.current = null;
      isInitialized.current = false;
    }
  }, [inboxId]);

  const updateConfigData = useCallback((field: keyof WebsiteConfigData, value: any) => {
    console.log('useWebsiteConfig - Updating field:', field, 'with value:', value);
    setConfigData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateWeeklyHours = useCallback((day: string, hours: any) => {
    setConfigData(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [day]: hours
      }
    }));
  }, []);

  const updatePreFormField = useCallback((index: number, field: any) => {
    setConfigData(prev => ({
      ...prev,
      preChatFormFields: prev.preChatFormFields.map((formField, i) =>
        i === index ? { ...formField, ...field } : formField
      )
    }));
  }, []);

  const updateFeature = useCallback((field: string, value: boolean) => {
    setConfigData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
  }, []);

  const updateSenderName = useCallback((field: string | symbol, value: any) => {
    setConfigData(prev => ({
      ...prev,
      senderName: {
        ...prev.senderName,
        [field]: value
      }
    }));
  }, []);

  const saveConfiguration = useCallback(async () => {
    if (!inboxId) return;
    
    const numericInboxId = parseInt(inboxId);
    
    try {
      switch (activeTab) {
        case 'settings':
          await inboxContext.updateInboxSettings(numericInboxId, configData);
          break;
        case 'business-hours':
          await inboxContext.updateBusinessHours(numericInboxId, configData);
          break;
        case 'csat':
          await inboxContext.updateCSATConfig(numericInboxId, configData);
          break;
        case 'pre-chat-form':
          await inboxContext.updatePreChatForm(numericInboxId, configData);
          break;
        case 'widget-builder':
          await inboxContext.updateWidgetConfig(numericInboxId, configData);
          break;
        default:
          await inboxContext.updateInboxSettings(numericInboxId, configData);
      }
      
      console.log('Website configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }, [inboxId, activeTab, configData, inboxContext]);

  return {
    loading: inboxContext.loading,
    saving: inboxContext.saving,
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
