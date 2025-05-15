
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
    // Si ya estamos cargando, no ejecutamos otra llamada
    if (fetchingPhoneNumbers) {
      console.log('Already fetching phone numbers, skipping duplicate request');
      return;
    }
    
    console.log('Starting to fetch phone numbers...');
    setFetchingPhoneNumbers(true);
    setPhoneNumberError(null);
    
    try {
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Fetched phone numbers:', data);
      
      if (Array.isArray(data)) {
        const phonesWithAgents = data.filter(phone => phone.outbound_agent_id);
        console.log('Phone numbers with agents:', phonesWithAgents.length);
        setPhoneNumbers(phonesWithAgents);
        
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
    }
  }, [fetchWithAuth, selectedPhoneNumber, setSelectedAgent]);

  // Realizar la llamada inicial solo una vez cuando el componente se monta
  useEffect(() => {
    console.log('usePhoneNumbers init, fetchAttempted:', fetchAttempted);
    if (!fetchAttempted) {
      fetchPhoneNumbers();
    }
  }, [fetchAttempted, fetchPhoneNumbers]);

  return {
    phoneNumbers,
    fetchingPhoneNumbers,
    phoneNumberError,
    fetchPhoneNumbers
  };
};
