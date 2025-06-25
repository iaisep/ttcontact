
import { useState } from 'react';
import type { FormData, Agent, FormErrors } from './types';

export const useTelegramForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    inboxName: '',
    botToken: ''
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // Mock agents data
  const agents: Agent[] = [
    { id: '1', name: 'Agent Smith', email: 'smith@company.com' },
    { id: '2', name: 'Agent Johnson', email: 'johnson@company.com' },
    { id: '3', name: 'Agent Brown', email: 'brown@company.com' }
  ];

  const validateStep2 = () => {
    const newErrors: FormErrors = {};

    if (!formData.inboxName.trim()) {
      newErrors.inboxName = 'Please enter a valid inbox name';
    }

    if (!formData.botToken.trim()) {
      newErrors.botToken = 'Please enter a valid bot token';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleCreateTelegramChannel = async (onComplete: () => void) => {
    setIsCreating(true);
    try {
      console.log('Creating Telegram inbox with data:', { formData, selectedAgents });
      
      // Use the Chatwoot API to create the inbox
      if ((window as any).createTelegramInbox) {
        await (window as any).createTelegramInbox({
          name: formData.inboxName,
          botToken: formData.botToken,
        });
        
        console.log('Telegram inbox created successfully');
        onComplete();
      } else {
        console.error('createTelegramInbox function not found on window');
        throw new Error('Telegram inbox creation function not available');
      }
      
    } catch (error) {
      console.error('Error creating Telegram inbox:', error);
      throw error;
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
    handleInputChange,
    handleNextStep,
    handleCreateTelegramChannel
  };
};
