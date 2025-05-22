
export const guides = [
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
];
