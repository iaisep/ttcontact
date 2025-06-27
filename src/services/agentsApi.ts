
const CHATWOOT_API_KEY = 'YZEKfqAJsnEWoshpdRCq9yZn';
const CHATWOOT_BASE_URL = 'https://chatwoot.totalcontact.com.mx/api/v1/accounts/1';

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AgentBot {
  id: number;
  name: string;
  description?: string;
  outgoing_url?: string;
}

class AgentsApiService {
  private baseUrl = CHATWOOT_BASE_URL;
  private apiKey = CHATWOOT_API_KEY;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'api_access_token': this.apiKey,
      ...options.headers,
    };

    console.log('Making Agents API request:', { url, method: options.method || 'GET' });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agents API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Agents API request failed:', error);
      throw error;
    }
  }

  // Get all agents
  async getAgents(): Promise<Agent[]> {
    const response = await this.makeRequest('/agents');
    return response.payload || [];
  }

  // Get all agent bots
  async getAgentBots(): Promise<AgentBot[]> {
    const response = await this.makeRequest('/agent_bots');
    return response.payload || [];
  }
}

export const agentsApi = new AgentsApiService();
export type { Agent, AgentBot };
