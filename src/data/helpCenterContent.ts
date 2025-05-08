
export const helpCenterContent: Record<string, any[]> = {
  'introduction': [
    {
      id: 'intro-1',
      categoryName: 'Introduction',
      title: 'What is UISEP AI?',
      excerpt: 'Learn about UISEP AI and how it can transform your business communications',
      content: `
        <h2>What is UISEP AI?</h2>
        <p>UISEP AI is a platform that empowers businesses to create natural, contextual voice conversations between users and LLMs. Our technology enables you to build AI voice agents that can handle complex interactions through phone, web, or mobile applications.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Natural Voice Conversations</strong>: Create human-like interactions with emotional AI voices</li>
          <li><strong>Seamless Integration</strong>: Connect with phone systems, web interfaces, and mobile applications</li>
          <li><strong>Customization</strong>: Build voice agents that match your brand and specific use cases</li>
          <li><strong>Knowledge Base Integration</strong>: Enhance agents with your company's specific information</li>
        </ul>
        
        <p>With UISEP AI, businesses can automate customer service, sales, support, and other communication tasks while maintaining a natural and personalized experience for their users.</p>
      `
    },
    {
      id: 'intro-2',
      title: 'Getting Started with UISEP AI',
      excerpt: 'Step-by-step guide to set up your first AI voice agent',
      content: `
        <h2>Getting Started with UISEP AI</h2>
        <p>Follow these simple steps to create your first AI voice agent:</p>
        
        <h3>1. Create an Account</h3>
        <p>Sign up for a UISEP AI account at <a href="https://app.uisep.ai" target="_blank" rel="noopener noreferrer">app.uisep.ai</a>.</p>
        
        <h3>2. Create Your First Agent</h3>
        <p>Navigate to the Agents section in your dashboard and click "Add Agent". Give your agent a name and select your preferred LLM (Language Model) and voice.</p>
        
        <h3>3. Configure Your Agent</h3>
        <p>Set up your agent with a custom prompt describing its role, behavior, and how it should interact with users.</p>
        
        <h3>4. Add a Knowledge Base (Optional)</h3>
        <p>Upload documents or connect web sources to give your agent specific knowledge about your business or use case.</p>
        
        <h3>5. Test Your Agent</h3>
        <p>Use the Test feature to interact with your agent and refine its behavior before deploying it to your users.</p>
        
        <h3>6. Deploy Your Agent</h3>
        <p>Connect your agent to your website, app, or phone system using our SDKs or API.</p>
        
        <p>Once these steps are complete, your AI voice agent will be ready to interact with your users!</p>
      `
    }
  ],
  'agents': [
    {
      id: 'agents-1',
      categoryName: 'Agents',
      title: 'Creating and Configuring Agents',
      excerpt: 'Learn how to create and configure AI voice agents for your specific needs',
      content: `
        <h2>Creating and Configuring Agents</h2>
        <p>Agents are at the core of the UISEP AI platform. They represent the AI entities that interact with your users through voice conversations.</p>
        
        <h3>Creating a New Agent</h3>
        <ol>
          <li>Navigate to the Agents section in your dashboard</li>
          <li>Click "Add Agent" to create a new agent</li>
          <li>Enter a descriptive name for your agent</li>
          <li>Choose an LLM (Language Model) that best fits your needs</li>
          <li>Select a voice that represents your brand</li>
        </ol>
        
        <h3>Configuring Your Agent's Behavior</h3>
        <p>The agent's behavior is primarily controlled through the prompt you provide:</p>
        <ul>
          <li><strong>System Prompt</strong>: Defines the agent's role, personality, and constraints</li>
          <li><strong>Knowledge Context</strong>: Information that the agent can reference during conversations</li>
          <li><strong>Welcome Message</strong>: The first message your agent will say when a conversation begins</li>
        </ul>
        
        <h3>Advanced Settings</h3>
        <p>You can further customize your agent through advanced settings:</p>
        <ul>
          <li><strong>Speech Settings</strong>: Adjust speaking rate, pitch, and other voice characteristics</li>
          <li><strong>Model Parameters</strong>: Configure temperature, context length, and other AI parameters</li>
          <li><strong>Functions</strong>: Define specific functions that your agent can call to perform actions</li>
          <li><strong>Post-call Analysis</strong>: Set up automated analysis of conversation transcripts</li>
        </ul>
        
        <p>By carefully configuring these settings, you can create agents that perfectly match your use case and brand identity.</p>
      `
    }
  ],
  'phone-numbers': [
    {
      id: 'phone-1',
      categoryName: 'Phone Numbers',
      title: 'Setting Up Phone Numbers for Your Agents',
      excerpt: 'Learn how to connect phone numbers to your AI voice agents',
      content: `
        <h2>Setting Up Phone Numbers for Your Agents</h2>
        <p>UISEP AI allows you to connect phone numbers to your AI voice agents, enabling them to receive and make calls on standard phone networks.</p>
        
        <h3>Purchasing a Phone Number</h3>
        <ol>
          <li>Navigate to the Phone Numbers section in your dashboard</li>
          <li>Click "Purchase Number" to search for available numbers</li>
          <li>Choose a country and area code (if applicable)</li>
          <li>Select a number from the available options</li>
          <li>Complete the purchase process</li>
        </ol>
        
        <h3>Assigning an Agent to Your Phone Number</h3>
        <p>After purchasing a phone number:</p>
        <ol>
          <li>Select the number in your Phone Numbers list</li>
          <li>Click on "Agent Assignment"</li>
          <li>Choose the AI agent you want to handle calls to this number</li>
          <li>Configure any call settings specific to this number-agent pairing</li>
        </ol>
        
        <h3>Setting Up Outbound Calls</h3>
        <p>To enable your agent to make outbound calls:</p>
        <ol>
          <li>Navigate to the Phone Numbers section</li>
          <li>Select "Outbound Call Settings"</li>
          <li>Configure the caller ID to use for outbound calls</li>
          <li>Set any rate limits or scheduling parameters</li>
        </ol>
        
        <p>Once configured, your phone number will be active and ready to connect callers with your AI voice agent.</p>
      `
    }
  ],
  'knowledge-base': [
    {
      id: 'kb-1',
      categoryName: 'Knowledge Base',
      title: 'Setting Up Your Knowledge Base',
      excerpt: 'Learn how to enhance your agents with custom knowledge',
      content: `
        <h2>Setting Up Your Knowledge Base</h2>
        <p>The Knowledge Base feature allows you to enhance your AI voice agents with specific information about your business, products, or services.</p>
        
        <h3>Creating a Knowledge Base</h3>
        <ol>
          <li>Navigate to the Knowledge Base section in your dashboard</li>
          <li>Click "Add Knowledge Base" to create a new one</li>
          <li>Enter a name for your knowledge base</li>
        </ol>
        
        <h3>Adding Content to Your Knowledge Base</h3>
        <p>You can add content to your knowledge base in several ways:</p>
        
        <h4>URL Sources</h4>
        <ol>
          <li>Select "Add URL" in your knowledge base</li>
          <li>Enter the URL of the webpage containing relevant information</li>
          <li>Optionally enable auto-sync to keep the content updated</li>
        </ol>
        
        <h4>File Upload</h4>
        <ol>
          <li>Select "Add File" in your knowledge base</li>
          <li>Upload PDF, DOCX, TXT, or other supported file formats</li>
        </ol>
        
        <h4>Text Input</h4>
        <ol>
          <li>Select "Add Text" in your knowledge base</li>
          <li>Enter or paste text content directly</li>
          <li>Provide a title for the content</li>
        </ol>
        
        <h3>Connecting Knowledge Base to Agents</h3>
        <ol>
          <li>Navigate to the agent you want to enhance</li>
          <li>Go to the "Knowledge" section in agent settings</li>
          <li>Select the knowledge base you want to connect</li>
        </ol>
        
        <p>Once connected, your agent will be able to reference this information during conversations, providing more accurate and relevant responses to users' questions.</p>
      `
    }
  ],
  'api': [
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
  ],
  'security': [
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
  ],
  'faq': [
    {
      id: 'faq-1',
      categoryName: 'FAQ',
      title: 'Frequently Asked Questions',
      excerpt: 'Common questions and answers about using UISEP AI',
      content: `
        <h2>Frequently Asked Questions</h2>
        
        <h3>General Questions</h3>
        
        <h4>What is the difference between an agent and a phone number?</h4>
        <p>An agent is the AI entity that conducts conversations with users, while a phone number is a telecommunication endpoint that can be connected to an agent to enable phone calls.</p>
        
        <h4>Can I use my own LLM or voice models?</h4>
        <p>Yes, UISEP supports integration with certain custom LLMs and voice models. Contact our support team for more information about custom integrations.</p>
        
        <h4>Does UISEP work internationally?</h4>
        <p>Yes, UISEP supports phone numbers in multiple countries and can conduct conversations in various languages, depending on the LLM and voice models you select.</p>
        
        <h3>Billing Questions</h3>
        
        <h4>How is billing calculated?</h4>
        <p>Billing is typically based on a combination of factors including the number of agents, call minutes, API calls, and additional features used.</p>
        
        <h4>Can I set usage limits to control costs?</h4>
        <p>Yes, you can set limits on call durations, concurrent calls, and other usage parameters to control costs.</p>
        
        <h3>Technical Questions</h3>
        
        <h4>What programming languages are supported by the SDK?</h4>
        <p>We currently support JavaScript/TypeScript, Python, and React Native, with more language support coming soon.</p>
        
        <h4>How can I improve the response quality of my agents?</h4>
        <p>Response quality can be improved by providing better prompts, connecting relevant knowledge bases, selecting appropriate LLM parameters, and iteratively testing and refining your agent's behavior.</p>
        
        <h4>What formats are supported for knowledge base documents?</h4>
        <p>UISEP supports PDF, DOCX, TXT, CSV, and HTML formats for knowledge base documents, as well as direct URL imports from websites.</p>
      `
    }
  ],
  'call-history': [
    {
      id: 'callhistory-1',
      categoryName: 'Call History',
      title: 'Managing and Analyzing Call History',
      excerpt: 'Learn how to access, search, and analyze your agent call history',
      content: `
        <h2>Managing and Analyzing Call History</h2>
        <p>The Call History feature allows you to review past conversations between your agents and users, providing valuable insights into performance and user interactions.</p>
        
        <h3>Accessing Call History</h3>
        <ol>
          <li>Navigate to the Call History section in your dashboard</li>
          <li>View a chronological list of all calls handled by your agents</li>
          <li>Use filters to narrow down calls by date, agent, phone number, or duration</li>
        </ol>
        
        <h3>Call Details</h3>
        <p>For each call, you can access:</p>
        <ul>
          <li><strong>Transcripts</strong>: Complete text of the conversation</li>
          <li><strong>Audio Recordings</strong>: Listen to the conversation (if recording is enabled)</li>
          <li><strong>Call Metadata</strong>: Duration, timestamps, call outcome, etc.</li>
          <li><strong>Analytics</strong>: Sentiment analysis, topic detection, and other insights</li>
        </ul>
        
        <h3>Analyzing Call Performance</h3>
        <p>Use call history to improve your agent's performance:</p>
        <ul>
          <li>Identify common user questions or issues</li>
          <li>Find instances where the agent struggled to respond appropriately</li>
          <li>Analyze conversation flow and identify opportunities for improvement</li>
          <li>Compare performance metrics across different agents or configurations</li>
        </ul>
        
        <h3>Exporting Call Data</h3>
        <p>You can export call data for further analysis:</p>
        <ul>
          <li>Download individual call transcripts in text format</li>
          <li>Export call analytics in CSV or JSON format</li>
          <li>Access call recordings in standard audio formats</li>
          <li>Use the API to integrate call data with your own analytics systems</li>
        </ul>
        
        <p>By regularly reviewing your call history, you can continuously improve your agents' performance and provide better experiences for your users.</p>
      `
    }
  ],
  'api-keys': [
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
  ],
  'settings': [
    {
      id: 'settings-1',
      categoryName: 'Settings',
      title: 'Account and Workspace Settings',
      excerpt: 'Learn how to manage your account and workspace settings',
      content: `
        <h2>Account and Workspace Settings</h2>
        <p>Properly configuring your account and workspace settings ensures a smooth experience with UISEP AI.</p>
        
        <h3>Account Settings</h3>
        
        <h4>Profile Information</h4>
        <ul>
          <li>Update your name, email address, and other personal details</li>
          <li>Change your account password</li>
          <li>Enable or disable two-factor authentication for enhanced security</li>
        </ul>
        
        <h4>Notification Preferences</h4>
        <ul>
          <li>Configure email notifications for important events</li>
          <li>Set up alerts for usage thresholds or billing updates</li>
          <li>Manage subscription to product updates and newsletters</li>
        </ul>
        
        <h3>Workspace Settings</h3>
        
        <h4>Workspace Information</h4>
        <ul>
          <li>Update workspace name and description</li>
          <li>Upload or change workspace logo</li>
          <li>View workspace ID and other technical details</li>
        </ul>
        
        <h4>Team Management</h4>
        <ul>
          <li>Invite new team members to your workspace</li>
          <li>Assign roles and permissions to team members</li>
          <li>Remove team members who no longer require access</li>
        </ul>
        
        <h4>Billing and Usage</h4>
        <ul>
          <li>View current plan and usage information</li>
          <li>Update payment methods and billing information</li>
          <li>Access invoices and payment history</li>
          <li>Upgrade or change your subscription plan</li>
        </ul>
        
        <h4>Advanced Settings</h4>
        <ul>
          <li>Configure default parameters for new agents</li>
          <li>Set up default webhook endpoints</li>
          <li>Manage API rate limits and quotas</li>
          <li>Configure security settings and IP restrictions</li>
        </ul>
        
        <p>Regularly reviewing and updating these settings helps ensure that your UISEP AI implementation remains secure, efficient, and aligned with your business needs.</p>
      `
    }
  ],
  'guides': [
    {
      id: 'guides-1',
      categoryName: 'Guides',
      title: 'Creating an Effective Customer Service Agent',
      excerpt: 'Step-by-step guide to build a customer service AI voice agent',
      content: `
        <h2>Creating an Effective Customer Service Agent</h2>
        <p>This guide will help you create an AI voice agent specifically designed for customer service interactions.</p>
        
        <h3>Step 1: Define Your Agent's Purpose</h3>
        <p>Before creating your agent, clearly define:</p>
        <ul>
          <li>What specific customer service functions will the agent handle?</li>
          <li>What type of inquiries should be escalated to human agents?</li>
          <li>What information will the agent need access to?</li>
        </ul>
        
        <h3>Step 2: Create a New Agent</h3>
        <ol>
          <li>Navigate to the Agents section in your dashboard</li>
          <li>Click "Add Agent" to create a new agent</li>
          <li>Name your agent (e.g., "Customer Support Assistant")</li>
          <li>Select an appropriate LLM and voice that matches your brand</li>
        </ol>
        
        <h3>Step 3: Craft an Effective System Prompt</h3>
        <p>Example prompt structure:</p>
        <pre>
        You are a customer service representative for [Company Name], a company that [brief description].
        
        Your name is [Agent Name]. You are helpful, knowledgeable, and polite.
        
        When assisting customers:
        1. Greet them warmly and introduce yourself
        2. Listen carefully to their issue
        3. Ask clarifying questions if needed
        4. Provide clear solutions based on company policies and knowledge base
        5. Offer to escalate to a human agent for complex issues
        
        You cannot:
        - Process refunds over $100
        - Change customer account details
        - Make exceptions to company policies
        
        For these issues, offer to connect the customer with a human agent.
        </pre>
        
        <h3>Step 4: Create a Knowledge Base</h3>
        <ol>
          <li>Navigate to the Knowledge Base section</li>
          <li>Create a new knowledge base with relevant information:
            <ul>
              <li>FAQ documents</li>
              <li>Product information</li>
              <li>Return policies</li>
              <li>Troubleshooting guides</li>
            </ul>
          </li>
          <li>Connect this knowledge base to your agent</li>
        </ol>
        
        <h3>Step 5: Configure Welcome Message</h3>
        <p>Create a welcoming initial message:</p>
        <pre>
        "Hello, I'm [Agent Name], your virtual customer service representative at [Company Name]. How can I help you today?"
        </pre>
        
        <h3>Step 6: Test and Refine</h3>
        <ol>
          <li>Use the Test feature to simulate various customer inquiries</li>
          <li>Review transcripts to identify areas for improvement</li>
          <li>Refine the prompt and knowledge base as needed</li>
          <li>Test with different scenarios until you're satisfied with the responses</li>
        </ol>
        
        <h3>Step 7: Deploy Your Agent</h3>
        <ol>
          <li>Assign a phone number to your agent (if needed)</li>
          <li>Integrate with your website or app using our SDK</li>
          <li>Set up any necessary webhooks for CRM integration</li>
          <li>Configure monitoring to track performance</li>
        </ol>
        
        <p>By following these steps, you can create an effective customer service agent that provides consistent, helpful support to your customers.</p>
      `
    }
  ]
};
