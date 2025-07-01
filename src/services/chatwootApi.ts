
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
  }
};
