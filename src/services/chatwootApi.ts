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
  name: string;
  channel: {
    type: 'web_widget' | 'whatsapp' | 'telegram';
    website_url?: string;
    welcome_title?: string;
    welcome_tagline?: string;
    phone_number?: string;
    provider?: string;
    provider_config?: any;
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
        throw new Error(`Chatwout API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
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

  // Create a new inbox
  async createInbox(data: CreateInboxRequest): Promise<ChatwootInbox> {
    const response = await this.makeRequest('/inboxes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.payload;
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

  // Get inbox details
  async getInboxDetails(inboxId: number): Promise<ChatwootInbox> {
    const response = await this.makeRequest(`/inboxes/${inboxId}`);
    return response.payload;
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

  // Create WhatsApp inbox
  async createWhatsAppInbox(data: {
    name: string;
    phone_number: string;
    provider?: string;
    provider_config?: any;
  }): Promise<ChatwootInbox> {
    return this.createInbox({
      name: data.name,
      channel: {
        type: 'whatsapp',
        phone_number: data.phone_number,
        provider: data.provider,
        provider_config: data.provider_config,
      },
    });
  }

  // Create Telegram inbox
  async createTelegramInbox(data: {
    name: string;
    bot_token: string;
  }): Promise<ChatwootInbox> {
    return this.createInbox({
      name: data.name,
      channel: {
        type: 'telegram',
        provider_config: {
          bot_token: data.bot_token,
        },
      },
    });
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
