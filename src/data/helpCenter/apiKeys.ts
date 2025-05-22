
export const apiKeys = [
  {
    id: 'apikeys-1',
    categoryName: 'API Keys',
    title: 'Managing API Keys',
    excerpt: 'Learn how to create and manage API keys for secure access to UISEP API',
    content: `
        <h2>Managing API Keys</h2>
        <p>API keys are essential for authenticating your applications when making requests to the UISEP API.</p>
        
        <h3>Creating API Keys</h3>
        <ol>
          <li>Navigate to the API Keys section in your dashboard</li>
          <li>Click "Create API Key"</li>
          <li>Enter a descriptive name for the key (e.g., "Production Server," "Development Environment")</li>
          <li>Select the appropriate permission scope for the key</li>
          <li>Click "Generate Key"</li>
          <li>Copy and securely store your API key (it will only be shown once)</li>
        </ol>
        
        <h3>API Key Security</h3>
        <ul>
          <li><strong>Keep Keys Secret</strong>: Never expose API keys in client-side code or public repositories</li>
          <li><strong>Restrict Permissions</strong>: Use the principle of least privilege when setting key permissions</li>
          <li><strong>Regular Rotation</strong>: Periodically rotate your API keys to limit potential exposure</li>
          <li><strong>Monitoring</strong>: Regularly check API key usage for unusual patterns</li>
        </ul>
        
        <h3>Managing Existing Keys</h3>
        <p>For each API key in your account, you can:</p>
        <ul>
          <li><strong>View Usage</strong>: Monitor API calls made with the key</li>
          <li><strong>Revoke Access</strong>: Immediately invalidate a key if it's compromised</li>
          <li><strong>Update Description</strong>: Change the descriptive name of the key</li>
          <li><strong>Adjust Permissions</strong>: Modify the permission scope as needed</li>
        </ul>
        
        <h3>API Key Best Practices</h3>
        <ul>
          <li>Use different keys for different environments (development, staging, production)</li>
          <li>Implement key rotation as part of your security protocols</li>
          <li>Store API keys in secure environment variables or secret management systems</li>
          <li>Set up alerts for unusual API key usage or failed authorization attempts</li>
        </ul>
        
        <p>By following these best practices, you can ensure that your integration with UISEP API remains secure and reliable.</p>
      `
  }
];
