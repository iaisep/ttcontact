
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumber } from './types';

export const usePhoneNumberPurchase = (
  phoneNumbers: PhoneNumber[],
  setPhoneNumbers: (phones: PhoneNumber[]) => void,
  setSelectedPhoneId: (id: string | null) => void
) => {
  const { fetchWithAuth } = useApiContext();

  const purchasePhoneNumber = async (areaCode: string) => {
    try {
      const newNumber = await fetchWithAuth('/phone-numbers', {
        method: 'POST',
        body: JSON.stringify({ 
          area_code: areaCode || '415',
          country: 'US'
        }),
      });
      console.log('Purchased new phone number:', newNumber);
      
      // Ensure the new number has a friendly_name
      const processedNewNumber = {
        ...newNumber,
        friendly_name: newNumber.friendly_name || newNumber.number || 'New Phone'
      };
      
      setPhoneNumbers([...phoneNumbers, processedNewNumber]);
      setSelectedPhoneId(processedNewNumber.id);
      toast.success('Phone number purchased successfully');
      return true;
    } catch (error) {
      toast.error('Failed to purchase phone number');
      console.error(error);
      return false;
    }
  };

  const releasePhoneNumber = async (phoneId: string) => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) {
        toast.error('Phone number not found');
        return false;
      }
      
      await fetchWithAuth(`/phone-numbers/${phone.id}`, {
        method: 'DELETE',
      });
      
      setPhoneNumbers(phoneNumbers.filter(p => p.id !== phoneId));
      setSelectedPhoneId(phoneNumbers.length > 1 ? phoneNumbers[0].id : null);
      toast.success('Phone number released');
      return true;
    } catch (error) {
      toast.error('Failed to release phone number');
      console.error(error);
      return false;
    }
  };

  return {
    purchasePhoneNumber,
    releasePhoneNumber
  };
};
