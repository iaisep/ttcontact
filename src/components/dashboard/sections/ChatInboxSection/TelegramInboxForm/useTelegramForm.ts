
import { useState } from 'react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';
import type { FormData, Agent, FormErrors } from './types';

export const useTelegramForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [createdInboxId, setCreatedInboxId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    inboxName: 'Telegram Inbox', // Default name since field is hidden
    botToken: ''
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep2 = () => {
    const newErrors: FormErrors = {};

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

      // Create the Telegram inbox during validation
      setIsValidating(true);
      try {
        console.log('Creating Telegram inbox with bot token validation...');
        
        // Create the inbox using Chatwoot API without name field
        const newInbox = await chatwootApi.createTelegramInbox({
          bot_token: formData.botToken,
        });

        console.log('Telegram inbox created successfully:', newInbox);
        setCreatedInboxId(newInbox.id);
        toast.success('Bot token validated and inbox created!');
        setCurrentStep(3);
        
      } catch (error) {
        console.error('Error creating Telegram inbox:', error);
        toast.error('The bot token is incorrect or failed to create inbox. Please check your token and try again.');
        setErrors(prev => ({ ...prev, botToken: 'Invalid bot token or creation failed' }));
      } finally {
        setIsValidating(false);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleCreateTelegramChannel = async (onComplete: () => void) => {
    if (!createdInboxId) {
      toast.error('No inbox found to assign agents');
      return;
    }

    setIsCreating(true);
    try {
      // If agents are selected, add them to the already created inbox
      if (selectedAgents.length > 0) {
        try {
          const agentIds = selectedAgents.map(id => parseInt(id));
          await chatwootApi.addAgentToInbox(createdInboxId, agentIds);
          console.log('Agents added to inbox successfully');
          toast.success('Agents assigned successfully!');
        } catch (agentError) {
          console.error('Error adding agents to inbox:', agentError);
          toast.error('Failed to assign agents to inbox');
        }
      } else {
        toast.success('Telegram inbox is ready!');
      }

      onComplete();
      
    } catch (error) {
      console.error('Error completing Telegram inbox setup:', error);
      toast.error('Failed to complete inbox setup');
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
