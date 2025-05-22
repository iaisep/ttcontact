
export const security = [
  {
    id: 'security-1',
    categoryName: 'Security',
    title: 'Security Best Practices',
    excerpt: 'Learn how to secure your UISEP AI implementation',
    content: `
        <h2>Security Best Practices</h2>
        <p>Securing your UISEP AI implementation is crucial for protecting sensitive data and ensuring compliance with regulations.</p>
        
        <h3>API Key Security</h3>
        <ul>
          <li>Treat API keys like passwords</li>
          <li>Never expose API keys in client-side code</li>
          <li>Rotate API keys regularly</li>
          <li>Use separate API keys for development and production</li>
          <li>Set appropriate permission scopes for each API key</li>
        </ul>
        
        <h3>Access Control</h3>
        <ul>
          <li>Implement role-based access control for your UISEP dashboard</li>
          <li>Regularly review and remove unused accounts</li>
          <li>Enable two-factor authentication for all team members</li>
        </ul>
        
        <h3>Compliance and Data Protection</h3>
        <ul>
          <li>Inform users when they're interacting with an AI agent</li>
          <li>Implement appropriate data retention policies</li>
          <li>Ensure compliance with relevant regulations (GDPR, CCPA, HIPAA, etc.)</li>
          <li>Use encryption for sensitive data</li>
        </ul>
        
        <h3>Agent Security Settings</h3>
        <ul>
          <li>Configure appropriate fallbacks for sensitive topics</li>
          <li>Use content filtering to prevent inappropriate responses</li>
          <li>Implement input validation to prevent prompt injection</li>
        </ul>
        
        <h3>Webhooks and Integration Security</h3>
        <ul>
          <li>Validate webhook signatures</li>
          <li>Use HTTPS for all integrations</li>
          <li>Implement rate limiting to prevent abuse</li>
        </ul>
        
        <p>By following these best practices, you can ensure that your use of UISEP AI remains secure and compliant with relevant regulations.</p>
      `
  }
];
