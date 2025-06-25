
import { useState } from 'react';
import type { WebsiteFormData, Agent, FormErrors } from './types';

export const useWebsiteForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
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

  // Mock agents data
  const agents: Agent[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' }
  ];

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

  const generateScript = () => {
    const script = `<script>
  (function(d,t) {
    var BASE_URL="https://chatwout.totalcontact.com.mx";
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

  const handleNextStep = () => {
    if (currentStep === 2 && validateForm()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Generate script after selecting agents
      const script = generateScript();
      setGeneratedScript(script);
      setCurrentStep(4);
    }
  };

  const handleCreateWebsiteChannel = async (onComplete: () => void) => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new inbox to the global list
      if ((window as any).addNewInbox) {
        (window as any).addNewInbox({
          name: formData.websiteName,
          platform: 'Website',
          url: formData.websiteDomain
        });
      }
      
      console.log('Website channel created successfully');
      onComplete();
    } catch (error) {
      console.error('Error creating website channel:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isCreating,
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
