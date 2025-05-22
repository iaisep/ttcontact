
export const api = [
  {
    id: 'api-1',
    categoryName: 'API',
    title: 'Introduction to UISEP API',
    excerpt: 'Learn how to interact with UISEP AI programmatically through our API',
    content: `
        <h2>Introduction to UISEP API</h2>
        <p>The UISEP API enables developers to integrate AI voice agents into their own applications and workflows programmatically.</p>
        
        <h3>API Overview</h3>
        <p>The UISEP API provides endpoints for:</p>
        <ul>
          <li>Creating and managing agents</li>
          <li>Starting and controlling voice conversations</li>
          <li>Managing phone numbers and calls</li>
          <li>Building and updating knowledge bases</li>
          <li>Retrieving analytics and conversation data</li>
        </ul>
        
        <h3>Authentication</h3>
        <p>All API requests require authentication using API keys:</p>
        <pre>
        curl -X GET https://api.uisepai.com/v1/agents \\
        -H "Authorization: Bearer YOUR_API_KEY"
        </pre>
        
        <h3>Core Endpoints</h3>
        <h4>Agents</h4>
        <ul>
          <li><code>GET /v1/agents</code> - List all agents</li>
          <li><code>GET /v1/agents/:id</code> - Get a specific agent</li>
          <li><code>POST /v1/agents</code> - Create a new agent</li>
          <li><code>PUT /v1/agents/:id</code> - Update an agent</li>
          <li><code>DELETE /v1/agents/:id</code> - Delete an agent</li>
        </ul>
        
        <h4>Calls</h4>
        <ul>
          <li><code>POST /v1/calls</code> - Initiate a new call</li>
          <li><code>GET /v1/calls/:id</code> - Get call status</li>
          <li><code>POST /v1/calls/:id/end</code> - End a call</li>
        </ul>
        
        <p>For complete API documentation and code examples, please visit our <a href="https://docs.uisepai.com/api-reference/introduction" target="_blank" rel="noopener noreferrer">API Reference</a>.</p>
      `
  }
];
