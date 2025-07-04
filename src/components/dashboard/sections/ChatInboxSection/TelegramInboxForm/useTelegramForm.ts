
import { useState } from 'react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';
import type { FormData, Agent, FormErrors } from './types';

export const useTelegramForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    inboxName: '',
    botToken: ''
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleNextStep = async () => {
    if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }

      // Validate bot token with Chatwoot API
      setIsValidating(true);
      try {
        console.log('Validating Telegram bot token...');
        const isValid = await chatwootApi.validateTelegramBotToken(formData.botToken);
        
        if (isValid) {
          console.log('Bot token is valid, proceeding to next step');
          setCurrentStep(3);
        } else {
          console.log('Bot token is invalid');
          toast.error('The bot token is incorrect. Please check your token and try again.');
          setErrors(prev => ({ ...prev, botToken: 'Invalid bot token' }));
        }
      } catch (error) {
        console.error('Error validating bot token:', error);
        toast.error('Failed to validate bot token. Please try again.');
      } finally {
        setIsValidating(false);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleCreateTelegramChannel = async (onComplete: () => void) => {
    setIsCreating(true);
    try {
      console.log('Creating Telegram inbox with data:', { formData, selectedAgents });
      
      // Create the inbox using Chatwoot API
      const newInbox = await chatwootApi.createTelegramInbox({
        name: formData.inboxName,
        bot_token: formData.botToken,
      });

      console.log('Telegram inbox created successfully:', newInbox);

      // If agents are selected, add them to the inbox
      if (selectedAgents.length > 0) {
        try {
          const agentIds = selectedAgents.map(id => parseInt(id));
          await chatwootApi.addAgentToInbox(newInbox.id, agentIds);
          console.log('Agents added to inbox successfully');
        } catch (agentError) {
          console.error('Error adding agents to inbox:', agentError);
          toast.error('Inbox created but failed to add agents');
        }
      }

      toast.success('Telegram inbox created successfully!');
      onComplete();
      
    } catch (error) {
      console.error('Error creating Telegram inbox:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create Telegram inbox');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isCreating,
    isValidating,
    formData,
    selectedAgents,
    setSelectedAgents,
    errors,
    handleInputChange,
    handleNextStep,
    handleCreateTelegramChannel
  };
};
