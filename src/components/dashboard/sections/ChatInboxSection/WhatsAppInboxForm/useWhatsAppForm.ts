
import { useState } from 'react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';
import type { FormData } from './types';

export const useWhatsAppForm = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    apiProvider: 'WhatsApp Cloud',
    inboxName: '',
    phoneNumber: '',
    phoneNumberId: '',
    businessAccountId: '',
    apiKey: ''
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.inboxName.trim()) {
      newErrors.inboxName = 'Please enter a valid inbox name';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (!formData.phoneNumber.startsWith('+')) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (formData.phoneNumber.includes(' ')) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (formData.phoneNumber.length < 8 || formData.phoneNumber.length > 15) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    } else if (!/^\+\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please provide a valid phone number that starts with a "+" sign and contains only numbers.';
    }

    if (!formData.phoneNumberId.trim()) {
      newErrors.phoneNumberId = 'Please enter a valid value.';
    }

    if (!formData.businessAccountId.trim()) {
      newErrors.businessAccountId = 'Please enter a valid value.';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'Please enter a valid value.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Special handling for phone number to auto-add + if missing and allow only numbers
    if (field === 'phoneNumber') {
      // Remove any spaces and non-numeric characters (except + at the beginning)
      value = value.replace(/\s/g, '');
      
      // If user starts typing without +, add it automatically
      if (value && !value.startsWith('+')) {
        value = '+' + value;
      }
      
      // Validate that after the + sign, only numbers are allowed
      if (value.length > 1) {
        const numbersOnly = value.slice(1).replace(/\D/g, ''); // Remove non-digits after +
        value = '+' + numbersOnly;
      }
    }
    
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

  const handleCreateWhatsAppChannel = async (onComplete: () => void) => {
    setIsCreating(true);
    try {
      console.log('Creating WhatsApp inbox with data:', { formData, selectedAgents });
      
      // Create the inbox using the API
      const newInbox = await chatwootApi.createWhatsAppInbox({
        name: formData.inboxName,
        phone_number: formData.phoneNumber,
        provider: 'whatsapp_cloud',
        provider_config: {
          phone_number_id: formData.phoneNumberId,
          business_account_id: formData.businessAccountId,
          api_key: formData.apiKey,
        }
      });

      console.log('WhatsApp inbox created successfully:', newInbox);

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

      toast.success('WhatsApp inbox created successfully!');
      onComplete();
      
    } catch (error) {
      console.error('Error creating WhatsApp inbox:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create WhatsApp inbox');
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
    handleInputChange,
    handleNextStep,
    handleCreateWhatsAppChannel
  };
};
