import { useState, useEffect, useCallback, useRef } from 'react';
import { useInboxContext } from '@/context/InboxContext';
import type { WebsiteConfigData } from './WebsiteConfigTypes';

export const useWebsiteConfig = (inboxId: string, inboxDetails?: any) => {
  const inboxContext = useInboxContext();
  const [activeTab, setActiveTab] = useState('settings');
  
  // Initialize with empty data - will be replaced with real data
  const [configData, setConfigData] = useState<WebsiteConfigData>({
    websiteName: '',
    websiteUrl: '',
    websiteDomain: '',
    channelAvatar: '',
    enableChannelGreeting: false,
    greetingType: 'disabled',
    greetingMessage: '',
    helpCenter: 'none',
    welcomeHeading: '',
    welcomeTagline: '',
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
    preChatMessage: '',
    requireEmail: false,
    requireFullName: false,
    requirePhoneNumber: false,
    preChatFormFields: [],
    agents: [],
    enableAutoAssignment: false,
    autoAssignmentLimit: 0,
    enableBusinessAvailability: false,
    unavailableMessage: '',
    timezone: '',
    weeklyHours: {
      sunday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      monday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' }
    },
    enableCSAT: false,
    displayType: 'emoji',
    csatMessage: '',
    surveyRule: {
      condition: 'contains',
      labels: []
    },
    widgetColor: '#1f93ff',
    position: 'right',
    launcherTitle: '',
    widgetStyle: 'standard',
    widgetBubblePosition: 'right',
    widgetBubbleType: 'standard',
    widgetBubbleLauncherTitle: '',
    userIdentityValidation: '',
    enforceUserIdentityValidation: false,
    senderNames: [],
    senderName: {
      type: 'friendly'
    },
    selectedBot: ''
  });

  // Refs to track state and prevent duplicate loads
  const loadedInboxRef = useRef<string | null>(null);
  const isInitialized = useRef(false);
  const lastSyncTimestamp = useRef<number>(0);

  // Helper function to get day name from number
  const getDayNameFromNumber = (dayNumber: number): string | null => {
    const dayMap: Record<number, string> = {
      0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
      4: 'thursday', 5: 'friday', 6: 'saturday'
    };
    return dayMap[dayNumber] || null;
  };

  // Transform real API data to UI format
  const transformInboxDetailsToConfig = useCallback((details: any): WebsiteConfigData => {
    console.log('useWebsiteConfig - transformInboxDetailsToConfig called with:', details);
    console.log('useWebsiteConfig - Details type:', typeof details);
    console.log('useWebsiteConfig - Details keys:', details ? Object.keys(details) : 'null');
    
    if (!details || typeof details !== 'object') {
      console.log('useWebsiteConfig - Invalid details provided, returning empty config');
      return configData;
    }

    // Handle channel data if present
    const channelData = details.channel || {};
    
    // Reply time mapping
    const replyTimeMap: Record<string, string> = {
      'in_a_few_minutes': 'In a few minutes',
      'in_an_hour': 'In an hour',
      'in_a_day': 'In a day'
    };

    // Extract website URL and derive domain
    const websiteUrl = details.website_url || channelData.website_url || '';
    const websiteDomain = websiteUrl ? 
      (() => {
        try {
          return new URL(websiteUrl).hostname;
        } catch {
          return websiteUrl.replace(/^https?:\/\//, '');
        }
      })() : '';

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
    const preChatFields = preChatOptions.pre_chat_fields || [];
    
    const transformedConfig: WebsiteConfigData = {
      // Direct mapping from API fields
      websiteName: details.name || '',
      websiteUrl: websiteUrl,
      websiteDomain: websiteDomain,
      channelAvatar: details.avatar_url || '',
      
      // Welcome messages
      welcomeHeading: details.welcome_title || channelData.welcome_title || '',
      welcomeTagline: details.welcome_tagline || channelData.welcome_tagline || '',
      
      // Widget settings
      widgetColor: details.widget_color || channelData.widget_color || '#1f93ff',
      
      // Greeting settings
      enableChannelGreeting: Boolean(details.greeting_enabled || channelData.greeting_enabled),
      greetingType: (details.greeting_enabled || channelData.greeting_enabled) ? 'custom' as const : 'disabled' as const,
      greetingMessage: details.greeting_message || channelData.greeting_message || '',
      
      // Reply time
      setReplyTime: replyTimeMap[details.reply_time || channelData.reply_time] || 'In a few minutes',
      
      // Launcher settings
      launcherTitle: details.welcome_title || channelData.welcome_title || 'Chat with us',
      widgetBubbleLauncherTitle: details.welcome_title || channelData.welcome_title || 'Chat with us',
      
      // Other settings from API or defaults
      helpCenter: 'none',
      enableEmailCollectBox: Boolean(details.enable_email_collect),
      allowMessagesAfterResolved: Boolean(details.allow_messages_after_resolved),
      enableConversationContinuity: Boolean(details.enable_conversation_continuity),
      
      // Features
      features: {
        enableFileUpload: Boolean(details.enable_file_upload),
        enableConversationNoteEmail: Boolean(details.enable_conversation_note_email),
        enableCSATSubtitle: Boolean(details.enable_csat_subtitle),
        enableTypingIndicator: Boolean(details.enable_typing_indicator),
        enableBusinessHours: Boolean(details.working_hours_enabled),
        enableCSAT: Boolean(details.csat_survey_enabled),
        enablePreChatForm: Boolean(details.pre_chat_form_enabled),
        enablePreChatMessage: Boolean(details.enable_pre_chat_message),
        enableReplyTime: Boolean(details.enable_reply_time),
        enableConversationContinuity: Boolean(details.enable_conversation_continuity),
        enableContactInformation: Boolean(details.enable_contact_information),
        enableEmailCollect: Boolean(details.enable_email_collect),
        enablePhoneNumberCollect: Boolean(details.enable_phone_number_collect),
        enableFullNameCollect: Boolean(details.enable_full_name_collect),
        displayFilePicker: Boolean(details.display_file_picker),
        displayEmojiPicker: Boolean(details.display_emoji_picker),
        allowUsersToEndConversation: Boolean(details.allow_users_to_end_conversation),
        useInboxNameAndAvatar: Boolean(details.use_inbox_name_and_avatar),
      },
      
      // Pre-chat form
      preChatFormEnabled: Boolean(details.pre_chat_form_enabled),
      enablePreChatForm: Boolean(details.pre_chat_form_enabled),
      preChatMessage: preChatOptions.pre_chat_message || '',
      requireEmail: Boolean(preChatOptions.require_email),
      requireFullName: Boolean(preChatOptions.require_full_name),
      requirePhoneNumber: Boolean(preChatOptions.require_phone_number),
      preChatFormFields: Array.isArray(preChatFields) ? preChatFields : [],
      
      // Agent settings
      agents: details.agents || [],
      enableAutoAssignment: Boolean(details.enable_auto_assignment),
      autoAssignmentLimit: details.auto_assignment_limit || 0,
      
      // Business hours
      enableBusinessAvailability: Boolean(details.working_hours_enabled),
      unavailableMessage: details.out_of_office_message || '',
      timezone: details.timezone || '',
      weeklyHours: transformedWeeklyHours,
      
      // CSAT
      enableCSAT: Boolean(details.csat_survey_enabled),
      displayType: (csatConfig.display_type === 'thumbs' ? 'thumbs' : 'emoji') as 'emoji' | 'thumbs',
      csatMessage: csatConfig.message || '',
      surveyRule: {
        condition: surveyRules.operator || 'contains',
        labels: surveyRules.values || []
      },
      
      // Widget appearance
      position: details.widget_position || 'right',
      widgetStyle: details.widget_style || 'standard',
      widgetBubblePosition: details.widget_bubble_position || 'right',
      widgetBubbleType: details.widget_bubble_type || 'standard',
      userIdentityValidation: details.user_identity_validation || '',
      enforceUserIdentityValidation: Boolean(details.enforce_user_identity_validation),
      senderNames: details.sender_names || [],
      senderName: details.sender_name || { type: 'friendly' },
      selectedBot: details.selected_bot || ''
    };

    console.log('useWebsiteConfig - Transformed config result:', {
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

  // Main effect for loading and syncing data
  useEffect(() => {
    const loadAndSyncData = async () => {
      // Skip if no inboxId or already loaded the same inbox recently
      if (!inboxId || loadedInboxRef.current === inboxId) {
        return;
      }

      console.log('useWebsiteConfig - Loading real data for inbox:', inboxId);
      
      try {
        let details = inboxDetails;
        
        // Load from context if available, otherwise fetch from API
        if (!details && inboxContext.inboxDetails && inboxContext.inboxDetails.id === parseInt(inboxId)) {
          details = inboxContext.inboxDetails;
          console.log('useWebsiteConfig - Using context data:', details);
        } else if (!details) {
          console.log('useWebsiteConfig - Loading from API...');
          await inboxContext.loadInboxDetails(parseInt(inboxId));
          details = inboxContext.inboxDetails;
          console.log('useWebsiteConfig - API data loaded:', details);
        }
        
        if (details && typeof details === 'object' && Object.keys(details).length > 0) {
          console.log('useWebsiteConfig - Processing valid details:', details);
          const newConfigData = transformInboxDetailsToConfig(details);
          setConfigData(newConfigData);
          
          // Mark as loaded and initialized
          loadedInboxRef.current = inboxId;
          isInitialized.current = true;
          lastSyncTimestamp.current = Date.now();
          
          console.log('useWebsiteConfig - Config data updated with real API data');
        } else {
          console.error('useWebsiteConfig - No valid details available after loading:', details);
        }
      } catch (error) {
        console.error('useWebsiteConfig - Error loading config:', error);
      }
    };
    
    loadAndSyncData();
  }, [inboxId, inboxDetails, inboxContext.inboxDetails, transformInboxDetailsToConfig]);

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
