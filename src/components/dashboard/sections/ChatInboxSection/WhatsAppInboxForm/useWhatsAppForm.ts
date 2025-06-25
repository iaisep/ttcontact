
import { useState } from 'react';
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
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new inbox to the ChatInboxSection
      const inboxData = {
        name: formData.inboxName,
        platform: 'WhatsApp',
        phoneNumber: formData.phoneNumber
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
      console.error('Error creating WhatsApp inbox:', error);
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
