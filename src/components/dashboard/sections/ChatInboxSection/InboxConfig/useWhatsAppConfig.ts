
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInboxContext } from '@/context/InboxContext';

export const useWhatsAppConfig = (inboxId: string, inboxDetails?: any) => {
  const inboxContext = useInboxContext();
  const [activeTab, setActiveTab] = useState('settings');
  const [configData, setConfigData] = useState({
    // WhatsApp specific default configuration
    name: 'WhatsApp Channel',
    phoneNumber: '',
    provider: 'whatsapp_cloud',
    welcomeMessage: 'Hello! How can we help you today?',
    enableBusinessHours: false,
    enableCSAT: false,
    enablePreChatForm: false,
    agents: [],
    businessHours: {
      enabled: false,
      timezone: 'UTC',
      weeklyHours: {
        monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
        tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
        wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
        thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
        friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
        saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
        sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
      }
    },
    csat: {
      enabled: false,
      displayType: 'emoji',
      message: 'Please rate your experience'
    }
  });

  const loadedInboxRef = useRef<string | null>(null);
  const isInitialized = useRef(false);
  const lastSyncTimestamp = useRef<number>(0);

  const transformInboxDetailsToConfig = useCallback((details: any) => {
    if (!details) return configData;

    console.log('useWhatsAppConfig - Transforming details for UI:', details);

    return {
      ...configData,
      name: details.name || configData.name,
      phoneNumber: details.phone_number || configData.phoneNumber,
      provider: details.provider || configData.provider,
      welcomeMessage: details.greeting_message || configData.welcomeMessage,
      enableBusinessHours: Boolean(details.working_hours_enabled),
      enableCSAT: Boolean(details.csat_survey_enabled),
      enablePreChatForm: Boolean(details.pre_chat_form_enabled),
      // Transform business hours if available
      businessHours: {
        ...configData.businessHours,
        enabled: Boolean(details.working_hours_enabled),
        timezone: details.timezone || configData.businessHours.timezone
      },
      csat: {
        ...configData.csat,
        enabled: Boolean(details.csat_survey_enabled),
        displayType: details.csat_config?.display_type || configData.csat.displayType,
        message: details.csat_config?.message || configData.csat.message
      }
    };
  }, [configData]);

  // Main effect for loading and syncing data
  useEffect(() => {
    const loadAndSyncData = async () => {
      if (!inboxId || loadedInboxRef.current === inboxId) {
        return;
      }

      console.log('useWhatsAppConfig - Loading data for inbox:', inboxId);
      
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
          console.log('useWhatsAppConfig - Applying transformed config:', newConfigData);
          setConfigData(newConfigData);
          
          loadedInboxRef.current = inboxId;
          isInitialized.current = true;
          lastSyncTimestamp.current = Date.now();
        }
      } catch (error) {
        console.error('useWhatsAppConfig - Error loading config:', error);
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
        console.log('useWhatsAppConfig - Syncing with context updates');
        const newConfigData = transformInboxDetailsToConfig(inboxContext.inboxDetails);
        setConfigData(newConfigData);
        lastSyncTimestamp.current = currentTimestamp;
      }
    }
  }, [inboxContext.inboxDetails, inboxId, transformInboxDetailsToConfig]);

  // Reset when inbox changes
  useEffect(() => {
    if (loadedInboxRef.current && loadedInboxRef.current !== inboxId) {
      console.log('useWhatsAppConfig - Inbox changed, resetting state');
      loadedInboxRef.current = null;
      isInitialized.current = false;
      lastSyncTimestamp.current = 0;
    }
  }, [inboxId]);

  const updateConfigData = useCallback((field: string, value: any) => {
    console.log('useWhatsAppConfig - Updating field:', field, 'with value:', value);
    setConfigData(prev => ({ ...prev, [field]: value }));
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
      
      console.log('WhatsApp configuration saved successfully');
    } catch (error) {
      console.error('Error saving WhatsApp configuration:', error);
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
    saveConfiguration
  };
};
