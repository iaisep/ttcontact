
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
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new inbox to the ChatInboxSection
      const inboxData = {
        name: formData.inboxName,
        platform: 'Telegram',
        botToken: formData.botToken
      };
      
      console.log('Calling addNewInbox with:', inboxData);
      
      if ((window as any).addNewInbox) {
        (window as any).addNewInbox(inboxData);
        console.log('addNewInbox called successfully');
      } else {
        console.error('addNewInbox function not found on window');
      }
      
      // Small delay to ensure state update
      setTimeout(() => {
        console.log('Completing form and navigating back');
        onComplete();
      }, 100);
      
    } catch (error) {
      console.error('Error creating Telegram inbox:', error);
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
