
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInboxContext } from '@/context/InboxContext';
import type { TelegramConfigData } from './TelegramConfigTypes';

export const useTelegramConfig = (inboxId: string, inboxDetails?: any) => {
  const inboxContext = useInboxContext();
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState<TelegramConfigData>({
    // Settings tab
    inboxName: 'Telegram Channel',
    channelAvatar: '',
    enableChannelGreeting: false,
    greetingType: 'disabled',
    helpCenter: 'none',

    // Collaborators tab
    agents: [],
    enableAutoAssignment: false,
    autoAssignmentLimit: 10,

    // Business Hours tab
    enableBusinessAvailability: false,
    unavailableMessage: '',
    timezone: 'UTC',
    weeklyHours: {
      monday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, allDay: false, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, allDay: false, startTime: '09:00', endTime: '17:00' }
    },

    // CSAT tab
    enableCSAT: false,
    displayType: 'emoji',
    csatMessage: 'Please rate your experience',
    surveyRule: {
      condition: 'contains',
      labels: []
    },

    // Bot Configuration tab
    selectedBot: ''
  });

  const loadedInboxRef = useRef<string | null>(null);
  const isInitialized = useRef(false);
  const lastSyncTimestamp = useRef<number>(0);

  const transformInboxDetailsToConfig = useCallback((details: any): TelegramConfigData => {
    if (!details) return configData;

    console.log('useTelegramConfig - Transforming details for UI:', details);

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

    return {
      // Settings tab
      inboxName: details.name || configData.inboxName,
      channelAvatar: details.avatar_url || configData.channelAvatar,
      enableChannelGreeting: Boolean(details.greeting_enabled),
      greetingType: details.greeting_enabled ? 'enabled' as const : 'disabled' as const,
      helpCenter: configData.helpCenter,

      // Collaborators tab
      agents: configData.agents,
      enableAutoAssignment: configData.enableAutoAssignment,
      autoAssignmentLimit: configData.autoAssignmentLimit,

      // Business Hours tab
      enableBusinessAvailability: Boolean(details.working_hours_enabled),
      unavailableMessage: details.out_of_office_message || configData.unavailableMessage,
      timezone: details.timezone || configData.timezone,
      weeklyHours: transformedWeeklyHours,

      // CSAT tab
      enableCSAT: Boolean(details.csat_survey_enabled),
      displayType: csatConfig.display_type === 'star' ? 'star' : 'emoji',
      csatMessage: csatConfig.message || configData.csatMessage,
      surveyRule: {
        condition: surveyRules.operator || configData.surveyRule.condition,
        labels: surveyRules.values || configData.surveyRule.labels
      },

      // Bot Configuration tab
      selectedBot: configData.selectedBot
    };
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
      if (!inboxId || loadedInboxRef.current === inboxId) {
        return;
      }

      console.log('useTelegramConfig - Loading data for inbox:', inboxId);
      
      try {
        let details = inboxDetails;
        
        if (!details && inboxContext.inboxDetails && inboxContext.inboxDetails.id === parseInt(inboxId)) {
          details = inboxContext.inboxDetails;
        } else if (!details) {
          await inboxContext.loadInboxDetails(parseInt(inboxId));
          details = inboxContext.inboxDetails;
        }
        
        if (details) {
          const newConfigData = transformInboxDetailsToConfig(details);
          console.log('useTelegramConfig - Applying transformed config:', newConfigData);
          setConfigData(newConfigData);
          
          loadedInboxRef.current = inboxId;
          isInitialized.current = true;
          lastSyncTimestamp.current = Date.now();
        }
      } catch (error) {
        console.error('useTelegramConfig - Error loading config:', error);
      }
    };
    
    loadAndSyncData();
  }, [inboxId, inboxDetails, inboxContext.inboxDetails, transformInboxDetailsToConfig]);

  // Sync with context updates
  useEffect(() => {
    if (
      inboxContext.inboxDetails && 
      inboxContext.inboxDetails.id === parseInt(inboxId) &&
      isInitialized.current
    ) {
      const currentTimestamp = Date.now();
      if (currentTimestamp - lastSyncTimestamp.current > 1000) {
        console.log('useTelegramConfig - Syncing with context updates');
        const newConfigData = transformInboxDetailsToConfig(inboxContext.inboxDetails);
        setConfigData(newConfigData);
        lastSyncTimestamp.current = currentTimestamp;
      }
    }
  }, [inboxContext.inboxDetails, inboxId, transformInboxDetailsToConfig]);

  // Reset when inbox changes
  useEffect(() => {
    if (loadedInboxRef.current && loadedInboxRef.current !== inboxId) {
      console.log('useTelegramConfig - Inbox changed, resetting state');
      loadedInboxRef.current = null;
      isInitialized.current = false;
      lastSyncTimestamp.current = 0;
    }
  }, [inboxId]);

  const updateConfigData = useCallback((field: keyof TelegramConfigData, value: any) => {
    console.log('useTelegramConfig - Updating field:', field, 'with value:', value);
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
        default:
          await inboxContext.updateInboxSettings(numericInboxId, configData);
      }
      
      console.log('Telegram configuration saved successfully');
    } catch (error) {
      console.error('Error saving Telegram configuration:', error);
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
    saveConfiguration
  };
};
