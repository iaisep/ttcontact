const CHATWOOT_API_KEY = 'YZEKfqAJsnEWoshpdRCq9yZn';
const CHATWOOT_BASE_URL = 'https://chatwoot.totalcontact.com.mx/api/v1/accounts/1'; // Replace 1 with actual account ID

interface ChatwootInbox {
  id: number;
  name: string;
  channel_type: string;
  website_url?: string;
  welcome_title?: string;
  welcome_tagline?: string;
  greeting_enabled?: boolean;
  greeting_message?: string;
  phone_number?: string;
  provider_config?: any;
  avatar_url?: string;
}

interface CreateInboxRequest {
  name?: string; // Made optional since Telegram doesn't require it
  channel: {
    type: 'web_widget' | 'whatsapp' | 'telegram';
    website_url?: string;
    welcome_title?: string;
    welcome_tagline?: string;
    phone_number?: string;
    provider?: string;
    provider_config?: any;
    bot_token?: string;
  };
}

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
  available_name?: string;
  account_id?: number;
  availability_status?: string;
  auto_offline?: boolean;
  confirmed?: boolean;
  thumbnail?: string;
  custom_role_id?: number | null;
}

class ChatwootApiService {
  private baseUrl = CHATWOOT_BASE_URL;
  private apiKey = CHATWOOT_API_KEY;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'api_access_token': this.apiKey,
      ...options.headers,
    };

    console.log('Making Chatwoot API request:', { url, method: options.method || 'GET' });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chatwoot API error response:', errorText);
        throw new Error(`Chatwoot API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Chatwoot API response data:', data);
      return data;
    } catch (error) {
      console.error('Chatwoot API request failed:', error);
      throw error;
    }
  }

  // Get all inboxes
  async getInboxes(): Promise<ChatwootInbox[]> {
    const response = await this.makeRequest('/inboxes');
    return response.payload || [];
  }

  // Create a new inbox - Fixed to handle direct response for inbox creation
  async createInbox(data: CreateInboxRequest): Promise<ChatwootInbox> {
    const response = await this.makeRequest('/inboxes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // For inbox creation, the API returns the inbox data directly, not wrapped in payload
    return response;
  }

  // Update an inbox
  async updateInbox(inboxId: number, data: Partial<CreateInboxRequest>): Promise<ChatwootInbox> {
    const response = await this.makeRequest(`/inboxes/${inboxId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.payload;
  }

  // Delete an inbox
  async deleteInbox(inboxId: number): Promise<void> {
    await this.makeRequest(`/inboxes/${inboxId}`, {
      method: 'DELETE',
    });
  }

  // Get inbox details - Fixed to handle response properly
  async getInboxDetails(inboxId: number): Promise<ChatwootInbox> {
    console.log('Getting inbox details for ID:', inboxId);
    const response = await this.makeRequest(`/inboxes/${inboxId}`);
    
    // Check if response has payload property, otherwise return response directly
    const inboxData = response.payload || response;
    console.log('Processed inbox data:', inboxData);
    
    if (!inboxData || (typeof inboxData === 'object' && Object.keys(inboxData).length === 0)) {
      throw new Error(`No inbox data found for ID: ${inboxId}`);
    }
    
    return inboxData;
  }

  // Get agents for an inbox
  async getInboxAgents(inboxId: number): Promise<Agent[]> {
    const response = await this.makeRequest(`/inboxes/${inboxId}/agents`);
    return response.payload || [];
  }

  // Add agent to inbox
  async addAgentToInbox(inboxId: number, agentIds: number[]): Promise<void> {
    await this.makeRequest(`/inboxes/${inboxId}/agents`, {
      method: 'POST',
      body: JSON.stringify({ agent_ids: agentIds }),
    });
  }

  // Remove agent from inbox
  async removeAgentFromInbox(inboxId: number, agentIds: number[]): Promise<void> {
    await this.makeRequest(`/inboxes/${inboxId}/agents`, {
      method: 'DELETE',
      body: JSON.stringify({ agent_ids: agentIds }),
    });
  }

  // Update agent role in inbox
  async updateAgentRole(inboxId: number, agentId: number, role: string): Promise<void> {
    await this.makeRequest(`/inboxes/${inboxId}/agents/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Get all agents - Fixed to return the response directly since it's an array
  async getAgents(): Promise<Agent[]> {
    const response = await this.makeRequest('/agents');
    // The API returns the agents array directly, not wrapped in a payload
    return Array.isArray(response) ? response : (response.payload || []);
  }

  // Update inbox members
  async updateInboxMembers(inboxId: number, userIds: number[]): Promise<void> {
    await this.makeRequest('/inbox_members', {
      method: 'PATCH',
      body: JSON.stringify({ inbox_id: inboxId, user_ids: userIds }),
    });
  }

  // Get inbox members
  async getInboxMembers(inboxId: number): Promise<Agent[]> {
    const response = await this.makeRequest(`/inbox_members/${inboxId}`);
    return Array.isArray(response) ? response : (response.payload || []);
  }

  // Create WhatsApp inbox - FIXED with correct structure
  async createWhatsAppInbox(data: {
    name: string;
    phone_number: string;
    provider?: string;
    provider_config?: any;
  }): Promise<ChatwootInbox> {
    console.log('Creating WhatsApp inbox with data:', data);
    
    const requestBody = {
      name: data.name,
      channel: {
        type: 'whatsapp' as const,
        phone_number: data.phone_number,
        provider: 'whatsapp_cloud', // Fixed provider value
        provider_config: {
          api_key: data.provider_config?.api_key,
          phone_number_id: data.provider_config?.phone_number_id,
          business_account_id: data.provider_config?.business_account_id,
        },
      },
    };

    console.log('WhatsApp inbox request body:', JSON.stringify(requestBody, null, 2));
    return this.createInbox(requestBody);
  }

  // Validate Telegram bot token by creating a test inbox
  async validateTelegramBotToken(botToken: string): Promise<boolean> {
    try {
      console.log('Validating Telegram bot token:', botToken);
      
      const requestBody = {
        name: `temp_validation_${Date.now()}`, // Temporary name for validation
        channel: {
          type: 'telegram' as const,
          bot_token: botToken,
        },
      };

      console.log('Telegram validation request body:', JSON.stringify(requestBody, null, 2));
      
      // Try to create the inbox - if it succeeds, token is valid
      const response = await this.makeRequest('/inboxes', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      // If we get here, the token is valid
      // Delete the temporary inbox
      if (response?.id) {
        try {
          await this.deleteInbox(response.id);
        } catch (deleteError) {
          console.warn('Failed to delete temporary validation inbox:', deleteError);
        }
      }

      return true;
    } catch (error) {
      console.error('Telegram bot token validation failed:', error);
      return false;
    }
  }

  // Create Telegram inbox - Updated to not include name field
  async createTelegramInbox(data: {
    bot_token: string;
  }): Promise<ChatwootInbox> {
    console.log('Creating Telegram inbox with data:', data);
    
    const requestBody: CreateInboxRequest = {
      channel: {
        type: 'telegram' as const,
        bot_token: data.bot_token,
      },
    };

    console.log('Telegram inbox request body:', JSON.stringify(requestBody, null, 2));
    return this.createInbox(requestBody);
  }

  // Create Website inbox
  async createWebsiteInbox(data: {
    name: string;
    website_url: string;
    welcome_title?: string;
    welcome_tagline?: string;
  }): Promise<ChatwootInbox> {
    return this.createInbox({
      name: data.name,
      channel: {
        type: 'web_widget',
        website_url: data.website_url,
        welcome_title: data.welcome_title,
        welcome_tagline: data.welcome_tagline,
      },
    });
  }

  // Get agent bots
  async getAgentBots(): Promise<any[]> {
    const response = await this.makeRequest('/agent_bots');
    return Array.isArray(response) ? response : (response.payload || []);
  }

  // Set agent bot for inbox
  async setAgentBot(inboxId: number, agentBotId: number): Promise<void> {
    await this.makeRequest(`/inboxes/${inboxId}/set_agent_bot`, {
      method: 'POST',
      body: JSON.stringify({ agent_bot: agentBotId }),
    });
  }
}

export const chatwootApi = new ChatwootApiService();
export type { ChatwootInbox, Agent, CreateInboxRequest };
