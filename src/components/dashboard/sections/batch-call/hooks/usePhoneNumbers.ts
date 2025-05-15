
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumberData } from '../types';

export const usePhoneNumbers = (selectedPhoneNumber: string, setSelectedAgent: (agentId: string) => void) => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberData[]>([]);
  const [fetchingPhoneNumbers, setFetchingPhoneNumbers] = useState<boolean>(true);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);

  const fetchPhoneNumbers = async () => {
    // Evitamos múltiples llamadas durante el mismo ciclo de vida
    if (fetchingPhoneNumbers) return;
    
    setFetchingPhoneNumbers(true);
    setPhoneNumberError(null);
    try {
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Fetched phone numbers:', data);
      
      if (Array.isArray(data)) {
        const phonesWithAgents = data.filter(phone => phone.outbound_agent_id);
        setPhoneNumbers(phonesWithAgents);
        
        if (phonesWithAgents.length > 0 && !selectedPhoneNumber) {
          const firstPhone = phonesWithAgents[0];
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
  };

  // Realizar la llamada inicial solo una vez
  useEffect(() => {
    if (!fetchAttempted) {
      fetchPhoneNumbers();
    }
  }, [fetchAttempted]);

  return {
    phoneNumbers,
    fetchingPhoneNumbers,
    phoneNumberError,
    fetchPhoneNumbers
  };
};
