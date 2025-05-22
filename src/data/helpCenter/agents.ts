
export const agents = [
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
];
