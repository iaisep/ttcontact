
import { useState, useEffect, useCallback } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumberData } from '../types';

export const usePhoneNumbers = (selectedPhoneNumber: string, setSelectedAgent: (agentId: string) => void) => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberData[]>([]);
  const [fetchingPhoneNumbers, setFetchingPhoneNumbers] = useState<boolean>(true);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);

  const fetchPhoneNumbers = useCallback(async () => {
    console.log('fetchPhoneNumbers called, current state:', { fetchingPhoneNumbers, fetchAttempted });
    
    setFetchingPhoneNumbers(true);
    setPhoneNumberError(null);
    
    try {
      console.log('Making API call to fetch phone numbers...');
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Fetched phone numbers successful:', data);
      
      if (Array.isArray(data)) {
        // Filter phone numbers that have an outbound agent assigned
        const phonesWithAgents = data.filter(phone => phone.outbound_agent_id);
        console.log('Phone numbers with agents:', phonesWithAgents.length);
        setPhoneNumbers(phonesWithAgents);
        
        // Auto-select first phone number with agent if none is selected
        if (phonesWithAgents.length > 0 && !selectedPhoneNumber) {
          const firstPhone = phonesWithAgents[0];
          console.log('Auto-selecting first phone with agent:', firstPhone.phone_number);
          setSelectedAgent(firstPhone.outbound_agent_id);
        }
      } else {
        console.error('Expected array but got:', data);
        setPhoneNumberError('Invalid phone number data format');
      }
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
      setPhoneNumberError('Failed to load phone numbers');
      toast.error('Failed to load phone numbers');
    } finally {
      setFetchingPhoneNumbers(false);
      setFetchAttempted(true);
      console.log('Phone number fetch completed');
    }
  }, [fetchWithAuth, selectedPhoneNumber, setSelectedAgent]);

  // Use a regular useEffect to make the API call when the component mounts
  useEffect(() => {
    console.log('usePhoneNumbers effect running');
    fetchPhoneNumbers();
  }, [fetchPhoneNumbers]);

  return {
    phoneNumbers,
    fetchingPhoneNumbers,
    phoneNumberError,
    fetchPhoneNumbers
  };
};
