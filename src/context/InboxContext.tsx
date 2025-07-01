
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';

interface AuthHeaders {
  'access-token': string;
  'client': string;
  'expiry': string;
  'uid': string;
  'token-type': string;
}

interface InboxContextType {
  inboxDetails: any;
  loading: boolean;
  saving: boolean;
  updateInboxSettings: (inboxId: number, data: any) => Promise<void>;
  updateBusinessHours: (inboxId: number, data: any) => Promise<void>;
  updateCSATConfig: (inboxId: number, data: any) => Promise<void>;
  updatePreChatForm: (inboxId: number, data: any) => Promise<void>;
  updateWidgetConfig: (inboxId: number, data: any) => Promise<void>;
  loadInboxDetails: (inboxId: number) => Promise<void>;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

// Cache for inbox details to avoid repeated API calls
const inboxCache = new Map<number, any>();

// Data transformers - UI to API format
const transformSettingsToFormData = (data: any): FormData => {
  const formData = new FormData();
  
  if (data.websiteName) formData.append('name', data.websiteName);
  if (data.websiteUrl) formData.append('channel[website_url]', data.websiteUrl);
  if (data.welcomeHeading) formData.append('channel[welcome_title]', data.welcomeHeading);
  if (data.welcomeTagline) formData.append('channel[welcome_tagline]', data.welcomeTagline);
  if (data.widgetColor) formData.append('channel[widget_color]', data.widgetColor);
  if (data.greetingMessage) formData.append('channel[greeting_message]', data.greetingMessage);
  if (data.enableChannelGreeting !== undefined) {
    formData.append('channel[greeting_enabled]', data.enableChannelGreeting.toString());
  }
  
  return formData;
};

const transformBusinessHoursToJson = (data: any) => {
  const workingHours = [];
  
  Object.entries(data.weeklyHours || {}).forEach(([day, hours]: [string, any]) => {
    if (hours.enabled) {
      workingHours.push({
        day_of_week: getDayNumber(day),
        closed_all_day: false,
        open_hour: parseInt(hours.startTime.split(':')[0]),
        open_minutes: parseInt(hours.startTime.split(':')[1]),
        close_hour: parseInt(hours.endTime.split(':')[0]),
        close_minutes: parseInt(hours.endTime.split(':')[1])
      });
    }
  });

  return {
    working_hours_enabled: data.enableBusinessAvailability,
    out_of_office_message: data.unavailableMessage || '',
    timezone: data.timezone,
    working_hours: workingHours
  };
};

const transformCSATToJson = (data: any) => {
  return {
    csat_survey_enabled: data.enableCSAT,
    csat_config: {
      display_type: data.displayType,
      message: data.csatMessage,
      survey_rules: {
        operator: data.surveyRule?.condition || 'contains',
        values: data.surveyRule?.labels || []
      }
    }
  };
};

const transformPreChatToJson = (data: any) => {
  return {
    channel: {
      pre_chat_form_enabled: data.enablePreChatForm || data.preChatFormEnabled,
      pre_chat_form_options: {
        pre_chat_message: data.preChatMessage,
        pre_chat_fields: data.preChatFormFields?.map((field: any) => ({
          name: field.name,
          type: field.type,
          label: field.label,
          enabled: field.enabled,
          required: field.required,
          field_type: field.field_type,
          placeholder: field.placeholder
        })) || []
      }
    }
  };
};

const transformWidgetConfigToFormData = (data: any): FormData => {
  const formData = new FormData();
  
  if (data.websiteName) formData.append('name', data.websiteName);
  if (data.widgetColor) formData.append('channel[widget_color]', data.widgetColor);
  if (data.welcomeHeading) formData.append('channel[welcome_title]', data.welcomeHeading);
  if (data.welcomeTagline) formData.append('channel[welcome_tagline]', data.welcomeTagline);
  if (data.setReplyTime) {
    const replyTimeMap: Record<string, string> = {
      'In a few minutes': 'in_a_few_minutes',
      'In an hour': 'in_an_hour',
      'In a day': 'in_a_day'
    };
    formData.append('channel[reply_time]', replyTimeMap[data.setReplyTime] || 'in_a_few_minutes');
  }
  
  return formData;
};

const getDayNumber = (day: string): number => {
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6
  };
  return dayMap[day.toLowerCase()] || 0;
};

// Get auth headers (mock for now - in real app this would come from auth context)
const getAuthHeaders = (): AuthHeaders => ({
  'access-token': 'h7fpVT1KyRPCQEEWvElPAQ',
  'client': 'pV5FfmfN0bu2s07xzuaWWA',
  'expiry': '1756705343',
  'uid': 'iallamadas@universidadisep.com',
  'token-type': 'Bearer'
});

export const InboxContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inboxDetails, setInboxDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const makeAuthenticatedRequest = async (
    url: string, 
    options: RequestInit & { contentType?: 'json' | 'form-data' }
  ) => {
    const headers: Record<string, string> = {
      ...getAuthHeaders(),
    };

    if (options.contentType === 'json') {
      headers['Content-Type'] = 'application/json';
    }
    // For form-data, don't set Content-Type header - browser will set it with boundary

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  };

  const loadInboxDetails = useCallback(async (inboxId: number) => {
    // Check cache first
    if (inboxCache.has(inboxId)) {
      console.log('InboxContext - Using cached data for inbox:', inboxId);
      const cachedData = inboxCache.get(inboxId);
      setInboxDetails(cachedData);
      return;
    }

    try {
      setLoading(true);
      console.log('InboxContext - Loading inbox details for ID:', inboxId);
      
      const details = await chatwootApi.getInboxDetails(inboxId);
      console.log('InboxContext - Loaded inbox details:', details);
      
      // Cache the result
      inboxCache.set(inboxId, details);
      setInboxDetails(details);
    } catch (error) {
      console.error('InboxContext - Failed to load inbox details:', error);
      toast.error('Failed to load inbox details');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInboxSettings = useCallback(async (inboxId: number, data: any) => {
    try {
      setSaving(true);
      console.log('InboxContext - Updating settings for inbox:', inboxId, data);
      
      const formData = transformSettingsToFormData(data);
      const url = `https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`;
      
      const response = await makeAuthenticatedRequest(url, {
        method: 'PATCH',
        body: formData,
        contentType: 'form-data'
      });
      
      console.log('InboxContext - Settings updated:', response);
      
      // Update cache and state
      inboxCache.set(inboxId, response);
      setInboxDetails(response);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('InboxContext - Failed to update settings:', error);
      toast.error('Failed to update settings');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateBusinessHours = useCallback(async (inboxId: number, data: any) => {
    try {
      setSaving(true);
      console.log('InboxContext - Updating business hours for inbox:', inboxId, data);
      
      const jsonData = transformBusinessHoursToJson(data);
      const url = `https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`;
      
      const response = await makeAuthenticatedRequest(url, {
        method: 'PATCH',
        body: JSON.stringify(jsonData),
        contentType: 'json'
      });
      
      console.log('InboxContext - Business hours updated:', response);
      
      // Update cache and state
      inboxCache.set(inboxId, response);
      setInboxDetails(response);
      toast.success('Business hours updated successfully');
    } catch (error) {
      console.error('InboxContext - Failed to update business hours:', error);
      toast.error('Failed to update business hours');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateCSATConfig = useCallback(async (inboxId: number, data: any) => {
    try {
      setSaving(true);
      console.log('InboxContext - Updating CSAT config for inbox:', inboxId, data);
      
      const jsonData = transformCSATToJson(data);
      const url = `https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`;
      
      const response = await makeAuthenticatedRequest(url, {
        method: 'PATCH',
        body: JSON.stringify(jsonData),
        contentType: 'json'
      });
      
      console.log('InboxContext - CSAT config updated:', response);
      
      // Update cache and state
      inboxCache.set(inboxId, response);
      setInboxDetails(response);
      toast.success('CSAT configuration updated successfully');
    } catch (error) {
      console.error('InboxContext - Failed to update CSAT config:', error);
      toast.error('Failed to update CSAT configuration');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updatePreChatForm = useCallback(async (inboxId: number, data: any) => {
    try {
      setSaving(true);
      console.log('InboxContext - Updating pre-chat form for inbox:', inboxId, data);
      
      const jsonData = transformPreChatToJson(data);
      const url = `https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`;
      
      const response = await makeAuthenticatedRequest(url, {
        method: 'PATCH',
        body: JSON.stringify(jsonData),
        contentType: 'json'
      });
      
      console.log('InboxContext - Pre-chat form updated:', response);
      
      // Update cache and state
      inboxCache.set(inboxId, response);
      setInboxDetails(response);
      toast.success('Pre-chat form updated successfully');
    } catch (error) {
      console.error('InboxContext - Failed to update pre-chat form:', error);
      toast.error('Failed to update pre-chat form');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateWidgetConfig = useCallback(async (inboxId: number, data: any) => {
    try {
      setSaving(true);
      console.log('InboxContext - Updating widget config for inbox:', inboxId, data);
      
      const formData = transformWidgetConfigToFormData(data);
      const url = `https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes/${inboxId}`;
      
      const response = await makeAuthenticatedRequest(url, {
        method: 'PATCH',
        body: formData,
        contentType: 'form-data'
      });
      
      console.log('InboxContext - Widget config updated:', response);
      
      // Update cache and state
      inboxCache.set(inboxId, response);
      setInboxDetails(response);
      toast.success('Widget configuration updated successfully');
    } catch (error) {
      console.error('InboxContext - Failed to update widget config:', error);
      toast.error('Failed to update widget configuration');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const value: InboxContextType = {
    inboxDetails,
    loading,
    saving,
    updateInboxSettings,
    updateBusinessHours,
    updateCSATConfig,
    updatePreChatForm,
    updateWidgetConfig,
    loadInboxDetails,
  };

  return (
    <InboxContext.Provider value={value}>
      {children}
    </InboxContext.Provider>
  );
};

export const useInboxContext = () => {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error('useInboxContext must be used within an InboxContextProvider');
  }
  return context;
};
