
// Chatwoot API service
const CHATWOOT_BASE_URL = 'https://chatwoot.totalcontact.com.mx/api/v1';
const API_ACCESS_TOKEN = 'YZEKfqAJsnEWoshpdRCq9yZn';

const getAuthHeaders = () => ({
  'api_access_token': API_ACCESS_TOKEN,
  'Content-Type': 'application/json'
});

const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${CHATWOOT_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Type definitions
export interface ChatwootInbox {
  id: number;
  name: string;
  channel_type: string;
  website_url?: string;
  phone_number?: string;
  avatar_url?: string;
  [key: string]: any;
}

export const chatwootApi = {
  async getInboxDetails(inboxId: number) {
    console.log('chatwootApi - Fetching inbox details for ID:', inboxId);
    try {
      const response = await makeApiRequest(`/accounts/1/inboxes/${inboxId}`);
      console.log('chatwootApi - Raw response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error fetching inbox details:', error);
      throw error;
    }
  },

  async getInboxes() {
    console.log('chatwootApi - Fetching all inboxes');
    try {
      const response = await makeApiRequest('/accounts/1/inboxes');
      console.log('chatwootApi - Inboxes response:', response);
      return response.payload || response;
    } catch (error) {
      console.error('chatwootApi - Error fetching inboxes:', error);
      throw error;
    }
  },

  async getAgents() {
    console.log('chatwootApi - Fetching agents');
    try {
      const response = await makeApiRequest('/accounts/1/agents');
      console.log('chatwootApi - Agents response:', response);
      return response.payload || response;
    } catch (error) {
      console.error('chatwootApi - Error fetching agents:', error);
      throw error;
    }
  },

  async getAgentBots() {
    console.log('chatwootApi - Fetching agent bots');
    try {
      const response = await makeApiRequest('/accounts/1/agent_bots');
      console.log('chatwootApi - Agent bots response:', response);
      return response.payload || response;
    } catch (error) {
      console.error('chatwootApi - Error fetching agent bots:', error);
      throw error;
    }
  },

  async getInboxMembers(inboxId: number) {
    console.log('chatwootApi - Fetching inbox members for ID:', inboxId);
    try {
      const response = await makeApiRequest(`/accounts/1/inboxes/${inboxId}/members`);
      console.log('chatwootApi - Inbox members response:', response);
      return response.payload || response;
    } catch (error) {
      console.error('chatwootApi - Error fetching inbox members:', error);
      throw error;
    }
  },

  async updateInboxMembers(inboxId: number, userIds: number[]) {
    console.log('chatwootApi - Updating inbox members for ID:', inboxId, 'with users:', userIds);
    try {
      const response = await makeApiRequest(`/accounts/1/inboxes/${inboxId}/members`, {
        method: 'PATCH',
        body: JSON.stringify({ user_ids: userIds })
      });
      console.log('chatwootApi - Update inbox members response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error updating inbox members:', error);
      throw error;
    }
  },

  async createWhatsAppInbox(data: {
    name: string;
    phone_number: string;
    provider?: string;
    provider_config?: any;
  }) {
    console.log('chatwootApi - Creating WhatsApp inbox:', data);
    try {
      const response = await makeApiRequest('/accounts/1/inboxes', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          channel: {
            type: 'whatsapp',
            phone_number: data.phone_number,
            provider: data.provider || 'default',
            provider_config: data.provider_config || {}
          }
        })
      });
      console.log('chatwootApi - Create WhatsApp inbox response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error creating WhatsApp inbox:', error);
      throw error;
    }
  },

  async createTelegramInbox(data: {
    name: string;
    bot_token: string;
  }) {
    console.log('chatwootApi - Creating Telegram inbox:', data);
    try {
      const response = await makeApiRequest('/accounts/1/inboxes', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          channel: {
            type: 'telegram',
            bot_token: data.bot_token
          }
        })
      });
      console.log('chatwootApi - Create Telegram inbox response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error creating Telegram inbox:', error);
      throw error;
    }
  },

  async createWebsiteInbox(data: {
    name: string;
    website_url: string;
    welcome_title?: string;
    welcome_tagline?: string;
  }) {
    console.log('chatwootApi - Creating Website inbox:', data);
    try {
      const response = await makeApiRequest('/accounts/1/inboxes', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          channel: {
            type: 'web_widget',
            website_url: data.website_url,
            welcome_title: data.welcome_title,
            welcome_tagline: data.welcome_tagline
          }
        })
      });
      console.log('chatwootApi - Create Website inbox response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error creating Website inbox:', error);
      throw error;
    }
  },

  async deleteInbox(inboxId: number) {
    console.log('chatwootApi - Deleting inbox ID:', inboxId);
    try {
      const response = await makeApiRequest(`/accounts/1/inboxes/${inboxId}`, {
        method: 'DELETE'
      });
      console.log('chatwootApi - Delete inbox response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error deleting inbox:', error);
      throw error;
    }
  },

  async updateInbox(inboxId: number, data: any) {
    console.log('chatwootApi - Updating inbox ID:', inboxId, 'with data:', data);
    try {
      const response = await makeApiRequest(`/accounts/1/inboxes/${inboxId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      console.log('chatwootApi - Update inbox response:', response);
      return response;
    } catch (error) {
      console.error('chatwootApi - Error updating inbox:', error);
      throw error;
    }
  }
};
