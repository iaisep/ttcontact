
import { useCallback, useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumber } from './types';

export const useFetchPhoneNumbers = () => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhoneNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Raw phone numbers data from API:', data);
      if (Array.isArray(data)) {
        // Ensure each phone number has a friendly_name
        const processedData = data.map(phone => ({
          ...phone,
          friendly_name: phone.friendly_name || phone.number || 'Unnamed Phone'
        }));
        console.log('Processed phone numbers data:', processedData);
        setPhoneNumbers(processedData);
      } else {
        console.error('Expected array but got:', data);
        setPhoneNumbers([]);
      }
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
      setError('Failed to fetch phone numbers');
      toast.error('Failed to fetch phone numbers');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  return {
    phoneNumbers,
    setPhoneNumbers,
    loading,
    error,
    fetchPhoneNumbers
  };
};
