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

  // Refs to track state and prevent duplicate loads
  const loadedInboxRef = useRef<string | null>(null);
  const isInitialized = useRef(false);
  const lastSyncTimestamp = useRef<number>(0);

  // FIXED: Direct mapping from API response to UI fields
  const transformInboxDetailsToConfig = useCallback((details: any): WebsiteConfigData => {
    if (!details) return configData;

    console.log('useWebsiteConfig - Raw API Response for field mapping:', {
      id: details.id,
      name: details.name,
      website_url: details.website_url,
      welcome_title: details.welcome_title,
      welcome_tagline: details.welcome_tagline,
      widget_color: details.widget_color,
      greeting_enabled: details.greeting_enabled,
      greeting_message: details.greeting_message,
      reply_time: details.reply_time,
      channel: details.channel
    });

    // Handle channel data if present
    const channelData = details.channel || {};
    console.log('useWebsiteConfig - Channel data:', channelData);

    // Reply time mapping
    const replyTimeMap: Record<string, string> = {
      'in_a_few_minutes': 'In a few minutes',
      'in_an_hour': 'In an hour',
      'in_a_day': 'In a day'
    };

    // Extract website URL and derive domain
    const websiteUrl = details.website_url || channelData.website_url || configData.websiteUrl;
    const websiteDomain = websiteUrl ? 
      (() => {
        try {
          return new URL(websiteUrl).hostname;
        } catch {
          return websiteUrl.replace(/^https?:\/\//, '');
        }
      })() : configData.websiteDomain;

    // Handle business hours transformation
    const transformedWeeklyHours = { ...configData.weeklyHours };
    if (details.working_hours && Array.isArray(details.working_hours)) {
      details.working_hours.forEach((wh: any) => {
        const dayName = getDayNameFromNumber(wh.day_of_week);
        if (dayName) {
          transformedWeeklyHours[dayName] = {
            enabled: true,
            allDay: wh.closed_all_day === false,
            startTime: `${String(wh.open_hour).padStart(2, '0')}:${String(wh.open_minutes).padStart(2, '0')}`,
            endTime: `${String(wh.close_hour).padStart(2, '0')}:${String(wh.close_minutes).padStart(2, '0')}`
          };
        }
      });
    }

    // Handle CSAT configuration
    const csatConfig = details.csat_config || {};
    const surveyRules = csatConfig.survey_rules || {};

    // Handle pre-chat form fields
    const preChatOptions = details.pre_chat_form_options || {};
    const preChatFields = preChatOptions.pre_chat_fields || configData.preChatFormFields;
    
    const transformedConfig = {
      // FIXED: Direct field mapping for name -> websiteName
      websiteName: details.name || configData.websiteName,
      
      // FIXED: Direct field mapping for website_url -> websiteUrl
      websiteUrl: websiteUrl,
      websiteDomain: websiteDomain,
      
      channelAvatar: details.avatar_url || configData.channelAvatar,
      
      // FIXED: Direct field mapping for welcome_title -> welcomeHeading
      welcomeHeading: details.welcome_title || channelData.welcome_title || configData.welcomeHeading,
      
      // FIXED: Direct field mapping for welcome_tagline -> welcomeTagline
      welcomeTagline: details.welcome_tagline || channelData.welcome_tagline || configData.welcomeTagline,
      
      // FIXED: Direct field mapping for widget_color -> widgetColor
      widgetColor: details.widget_color || channelData.widget_color || configData.widgetColor,
      
      // FIXED: Direct field mapping for greeting_enabled -> enableChannelGreeting
      enableChannelGreeting: Boolean(details.greeting_enabled || channelData.greeting_enabled),
      greetingType: (details.greeting_enabled || channelData.greeting_enabled) ? 'custom' as const : 'disabled' as const,
      
      // FIXED: Direct field mapping for greeting_message -> greetingMessage
      greetingMessage: details.greeting_message || channelData.greeting_message || configData.greetingMessage,
      
      // FIXED: Direct field mapping for reply_time -> setReplyTime
      setReplyTime: replyTimeMap[details.reply_time || channelData.reply_time] || configData.setReplyTime,
      
      launcherTitle: details.welcome_title || channelData.welcome_title || configData.launcherTitle,
      widgetBubbleLauncherTitle: details.welcome_title || channelData.welcome_title || configData.widgetBubbleLauncherTitle,
      
      // Static settings (preserve existing values)
      helpCenter: configData.helpCenter,
      enableEmailCollectBox: configData.enableEmailCollectBox,
      allowMessagesAfterResolved: configData.allowMessagesAfterResolved,
      enableConversationContinuity: configData.enableConversationContinuity,
      
      // Features
      features: {
        ...configData.features,
        enableFileUpload: details.enable_file_upload ?? configData.features.enableFileUpload,
        enableBusinessHours: details.working_hours_enabled ?? configData.features.enableBusinessHours,
        enableCSAT: details.csat_survey_enabled ?? configData.features.enableCSAT,
        enablePreChatForm: details.pre_chat_form_enabled ?? configData.features.enablePreChatForm,
      },
      
      // Pre-chat form
      preChatFormEnabled: Boolean(details.pre_chat_form_enabled),
      enablePreChatForm: Boolean(details.pre_chat_form_enabled),
      preChatMessage: preChatOptions.pre_chat_message || configData.preChatMessage,
      requireEmail: configData.requireEmail,
      requireFullName: configData.requireFullName,
      requirePhoneNumber: configData.requirePhoneNumber,
      preChatFormFields: Array.isArray(preChatFields) ? preChatFields : configData.preChatFormFields,
      
      // Agent settings (preserve existing)
      agents: configData.agents,
      enableAutoAssignment: configData.enableAutoAssignment,
      autoAssignmentLimit: configData.autoAssignmentLimit,
      
      // Business hours
      enableBusinessAvailability: Boolean(details.working_hours_enabled),
      unavailableMessage: details.out_of_office_message || configData.unavailableMessage,
      timezone: details.timezone || configData.timezone,
      weeklyHours: transformedWeeklyHours,
      
      // CSAT - FIXED: Ensure displayType is only valid values
      enableCSAT: Boolean(details.csat_survey_enabled),
      displayType: (csatConfig.display_type === 'thumbs' ? 'thumbs' : 'emoji') as 'emoji' | 'thumbs',
      csatMessage: csatConfig.message || configData.csatMessage,
      surveyRule: {
        condition: surveyRules.operator || configData.surveyRule.condition,
        labels: surveyRules.values || configData.surveyRule.labels
      },
      
      // Widget settings (preserve existing)
      position: configData.position,
      widgetStyle: configData.widgetStyle,
      widgetBubblePosition: configData.widgetBubblePosition,
      widgetBubbleType: configData.widgetBubbleType,
      userIdentityValidation: configData.userIdentityValidation,
      enforceUserIdentityValidation: configData.enforceUserIdentityValidation,
      senderNames: configData.senderNames,
      senderName: configData.senderName,
      selectedBot: configData.selectedBot
    };

    console.log('useWebsiteConfig - Transformed config for UI:', {
      websiteName: transformedConfig.websiteName,
      websiteUrl: transformedConfig.websiteUrl,
      welcomeHeading: transformedConfig.welcomeHeading,
      welcomeTagline: transformedConfig.welcomeTagline,
      widgetColor: transformedConfig.widgetColor,
      enableChannelGreeting: transformedConfig.enableChannelGreeting,
      greetingMessage: transformedConfig.greetingMessage,
      setReplyTime: transformedConfig.setReplyTime
    });

    return transformedConfig;
  }, [configData]);

  // Helper function to get day name from number
  const getDayNameFromNumber = (dayNumber: number): string | null => {
    const dayMap: Record<number, string> = {
      0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
      4: 'thursday', 5: 'friday', 6: 'saturday'
    };
    return dayMap[dayNumber] || null;
  };

  // Main effect for loading and syncing data
  useEffect(() => {
    const loadAndSyncData = async () => {
      // Skip if no inboxId or already loaded the same inbox recently
      if (!inboxId || loadedInboxRef.current === inboxId) {
        return;
      }

      console.log('useWebsiteConfig - Loading data for inbox:', inboxId);
      
      try {
        let details = inboxDetails;
        
        // Load from context if available, otherwise fetch from API
        if (!details && inboxContext.inboxDetails && inboxContext.inboxDetails.id === parseInt(inboxId)) {
          details = inboxContext.inboxDetails;
        } else if (!details) {
          await inboxContext.loadInboxDetails(parseInt(inboxId));
          details = inboxContext.inboxDetails;
        }
        
        if (details) {
          const newConfigData = transformInboxDetailsToConfig(details);
          setConfigData(newConfigData);
          
          // Mark as loaded and initialized
          loadedInboxRef.current = inboxId;
          isInitialized.current = true;
          lastSyncTimestamp.current = Date.now();
        }
      } catch (error) {
        console.error('useWebsiteConfig - Error loading config:', error);
      }
    };
    
    loadAndSyncData();
  }, [inboxId, inboxDetails, inboxContext.inboxDetails, transformInboxDetailsToConfig]);

  // Effect to sync with context updates (for real-time updates after saves)
  useEffect(() => {
    if (
      inboxContext.inboxDetails && 
      inboxContext.inboxDetails.id === parseInt(inboxId) &&
      isInitialized.current
    ) {
      const currentTimestamp = Date.now();
      // Only sync if enough time has passed or it's a different dataset
      if (currentTimestamp - lastSyncTimestamp.current > 1000) {
        console.log('useWebsiteConfig - Syncing with context updates');
        const newConfigData = transformInboxDetailsToConfig(inboxContext.inboxDetails);
        setConfigData(newConfigData);
        lastSyncTimestamp.current = currentTimestamp;
      }
    }
  }, [inboxContext.inboxDetails, inboxId, transformInboxDetailsToConfig]);

  // Reset state when inbox changes
  useEffect(() => {
    if (loadedInboxRef.current && loadedInboxRef.current !== inboxId) {
      console.log('useWebsiteConfig - Inbox changed, resetting state');
      loadedInboxRef.current = null;
      isInitialized.current = false;
      lastSyncTimestamp.current = 0;
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
