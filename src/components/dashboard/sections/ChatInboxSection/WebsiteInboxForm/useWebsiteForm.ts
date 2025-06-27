
import { useState, useEffect } from 'react';
import type { WebsiteFormData, Agent, FormErrors } from './types';
import { toast } from 'sonner';

export const useWebsiteForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [inboxCreated, setInboxCreated] = useState(false); // Track if inbox was created
  const [formData, setFormData] = useState<WebsiteFormData>({
    websiteName: '',
    websiteDomain: '',
    widgetColor: '#1E40AF',
    welcomeHeading: 'Hi there !',
    welcomeTagline: 'We make it simple to connect with us. Ask us anything, or share your feedback.',
    enableChannelGreeting: false
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generatedScript, setGeneratedScript] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [createdInboxId, setCreatedInboxId] = useState<string | null>(null);

  const handleInputChange = (field: keyof WebsiteFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.websiteName.trim()) {
      newErrors.websiteName = 'Website name is required';
    }
    
    if (!formData.websiteDomain.trim()) {
      newErrors.websiteDomain = 'Website domain is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createWebsiteInbox = async () => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('name', formData.websiteName);
      formDataPayload.append('greeting_enabled', formData.enableChannelGreeting.toString());
      formDataPayload.append('greeting_message', '');
      formDataPayload.append('channel[type]', 'web_widget');
      formDataPayload.append('channel[website_url]', formData.websiteDomain);
      formDataPayload.append('channel[widget_color]', formData.widgetColor);
      formDataPayload.append('channel[welcome_title]', formData.welcomeHeading);
      formDataPayload.append('channel[welcome_tagline]', formData.welcomeTagline);

      const response = await fetch('https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/inboxes', {
        method: 'POST',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
        },
        body: formDataPayload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating inbox: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Website inbox created successfully:', result);
      
      setCreatedInboxId(result.payload?.id?.toString() || null);
      setInboxCreated(true); // Mark inbox as created
      toast.success('Website inbox created successfully');
      
      return result;
    } catch (error) {
      console.error('Error creating website inbox:', error);
      toast.error('Failed to create website inbox');
      throw error;
    }
  };

  const fetchAgents = async () => {
    try {
      setLoadingAgents(true);
      console.log('Fetching agents from Chatwoot API...');
      
      const response = await fetch('https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/agents', {
        method: 'GET',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching agents: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Agents fetched successfully:', result);
      
      const agentsData = result.payload || result;
      const transformedAgents: Agent[] = agentsData.map((agent: any) => ({
        id: agent.id.toString(),
        name: agent.name,
        email: agent.email
      }));
      
      setAgents(transformedAgents);
      toast.success(`Loaded ${transformedAgents.length} agents`);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
      // Fallback to mock data if API fails
      setAgents([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com' }
      ]);
    } finally {
      setLoadingAgents(false);
    }
  };

  const generateScript = () => {
    const script = `<script>
  (function(d,t) {
    var BASE_URL="https://chatwoot.totalcontact.com.mx";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.defer = true;
    g.async = true;
    g.src=BASE_URL+"/packs/js/sdk.js";
    s.parentNode.insertBefore(g,s);
    g.onload=function(){
      window.chatwootSDK.run({
        websiteToken: "NgXXjJMq3dAhqcMFTnVY",
        baseUrl: BASE_URL
      })
    }
  })(document,"script");
</script>`;
    return script;
  };

  const handleNextStep = async () => {
    if (currentStep === 2 && validateForm()) {
      try {
        setIsCreating(true);
        await createWebsiteInbox();
        await fetchAgents();
        setCurrentStep(3);
      } catch (error) {
        console.error('Error proceeding to next step:', error);
      } finally {
        setIsCreating(false);
      }
    } else if (currentStep === 3) {
      // Generate script after selecting agents
      const script = generateScript();
      setGeneratedScript(script);
      setCurrentStep(4);
    }
  };

  const handleCreateWebsiteChannel = async (onComplete: () => void) => {
    try {
      console.log('Completing Website inbox creation with agents:', selectedAgents);
      
      // If we have a created inbox and selected agents, we could assign agents here
      if (createdInboxId && selectedAgents.length > 0) {
        // This would be for assigning agents to the inbox
        // The API endpoint would be something like:
        // POST /api/v1/accounts/1/inboxes/{inbox_id}/agents
        console.log('Would assign agents to inbox:', createdInboxId, selectedAgents);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing website channel creation:', error);
      throw error;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isCreating,
    loadingAgents,
    inboxCreated, // Export the inbox created state
    formData,
    selectedAgents,
    setSelectedAgents,
    errors,
    agents,
    generatedScript,
    handleInputChange,
    handleNextStep,
    handleCreateWebsiteChannel
  };
};
