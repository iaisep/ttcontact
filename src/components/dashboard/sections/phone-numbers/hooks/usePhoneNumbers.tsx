
import { useState, useEffect, useCallback } from 'react';
import { PhoneNumber } from './types';
import { useFetchPhoneNumbers } from './useFetchPhoneNumbers';
import { usePhoneNumberPurchase } from './usePhoneNumberPurchase';
import { usePhoneNumberSettings } from './usePhoneNumberSettings';
import { useAgentAssignment } from './useAgentAssignment';

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

  // A more robust way to set initial selected phone ID when phoneNumbers are loaded
  const initializeSelectedPhone = useCallback(() => {
    if (phoneNumbers.length > 0 && !selectedPhoneId) {
      console.log('Setting initial selected phone ID to:', phoneNumbers[0].id);
      setSelectedPhoneId(phoneNumbers[0].id);
    } else if (phoneNumbers.length === 0) {
      console.log('No phone numbers available, clearing selected phone ID');
      setSelectedPhoneId(null);
    } else if (selectedPhoneId) {
      // Check if the currently selected phone still exists in the updated list
      const phoneStillExists = phoneNumbers.some(p => p.id === selectedPhoneId);
      if (!phoneStillExists) {
        console.log('Selected phone no longer exists, setting to first available phone');
        setSelectedPhoneId(phoneNumbers.length > 0 ? phoneNumbers[0].id : null);
      }
    }
  }, [phoneNumbers, selectedPhoneId]);

  // Initialize selected phone ID when phoneNumbers change
  useEffect(() => {
    initializeSelectedPhone();
  }, [initializeSelectedPhone]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('phoneNumbers state updated:', phoneNumbers);
    console.log('selectedPhoneId:', selectedPhoneId);
  }, [phoneNumbers, selectedPhoneId]);

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
