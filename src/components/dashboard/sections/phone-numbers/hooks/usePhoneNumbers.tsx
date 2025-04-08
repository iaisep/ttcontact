
import { useState, useEffect } from 'react';
import { PhoneNumber } from './types';
import { useFetchPhoneNumbers } from './useFetchPhoneNumbers';
import { usePhoneNumberPurchase } from './usePhoneNumberPurchase';
import { usePhoneNumberSettings } from './usePhoneNumberSettings';
import { useAgentAssignment } from './useAgentAssignment';

export type { PhoneNumber };

export const usePhoneNumbers = () => {
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  
  const { 
    phoneNumbers, 
    setPhoneNumbers, 
    loading, 
    error, 
    fetchPhoneNumbers 
  } = useFetchPhoneNumbers();
  
  const { 
    purchasePhoneNumber, 
    releasePhoneNumber 
  } = usePhoneNumberPurchase(phoneNumbers, setPhoneNumbers, setSelectedPhoneId);
  
  const { 
    updatePhoneName, 
    updateWebhook 
  } = usePhoneNumberSettings(phoneNumbers, setPhoneNumbers);
  
  const { assignAgent } = useAgentAssignment(phoneNumbers, setPhoneNumbers);

  // Set initial selected phone ID when phoneNumbers are loaded
  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhoneId) {
      setSelectedPhoneId(phoneNumbers[0].id);
    }
  }, [phoneNumbers, selectedPhoneId]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('phoneNumbers state updated:', phoneNumbers);
  }, [phoneNumbers]);

  return {
    phoneNumbers,
    selectedPhoneId,
    setSelectedPhoneId,
    loading,
    error,
    fetchPhoneNumbers,
    purchasePhoneNumber,
    releasePhoneNumber,
    updatePhoneName,
    updateWebhook,
    assignAgent
  };
};
