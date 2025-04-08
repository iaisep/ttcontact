
import { useCallback, useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

export interface PhoneNumber {
  id: string;
  number: string;
  friendly_name: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  inbound_webhook_url?: string | null;
}

export const usePhoneNumbers = () => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhoneNumbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Raw phone numbers data from API:', data);
      if (Array.isArray(data)) {
        // Asegurarse de que cada número telefónico tenga un friendly_name
        const processedData = data.map(phone => ({
          ...phone,
          friendly_name: phone.friendly_name || phone.number || 'Unnamed Phone'
        }));
        console.log('Processed phone numbers data:', processedData);
        setPhoneNumbers(processedData);
        if (processedData.length > 0 && !selectedPhoneId) {
          setSelectedPhoneId(processedData[0].id);
        }
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
  }, [fetchWithAuth, selectedPhoneId]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('phoneNumbers state updated:', phoneNumbers);
  }, [phoneNumbers]);

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
      await fetchWithAuth(`/phone-numbers/${phoneId}`, {
        method: 'DELETE',
      });
      setPhoneNumbers(phoneNumbers.filter(phone => phone.id !== phoneId));
      if (selectedPhoneId === phoneId) {
        setSelectedPhoneId(phoneNumbers.length > 1 ? phoneNumbers[0].id : null);
      }
      toast.success('Phone number released');
      return true;
    } catch (error) {
      toast.error('Failed to release phone number');
      console.error(error);
      return false;
    }
  };

  const updatePhoneName = async (phoneId: string, name: string) => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) return false;
      
      console.log(`Updating phone name for phone: ${phone.number} to: ${name}`);
      
      await fetchWithAuth(`/update-phone-number/${phone.number}`, {
        method: 'PUT',
        body: JSON.stringify({
          nickname: name,
          inbound_agent_id: phone.inbound_agent_id || null,
          outbound_agent_id: phone.outbound_agent_id || null,
          inbound_webhook_url: phone.inbound_webhook_url || null
        }),
      });
      
      setPhoneNumbers(phoneNumbers.map(p => 
        p.id === phoneId ? { ...p, friendly_name: name } : p
      ));
      
      toast.success('Phone name updated');
      return true;
    } catch (error) {
      toast.error('Failed to update phone name');
      console.error(error);
      return false;
    }
  };

  const updateWebhook = async (phoneId: string, webhookUrl: string | null) => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) return false;
      
      console.log(`Updating webhook for phone: ${phone.number} to: ${webhookUrl}`);
      
      await fetchWithAuth(`/update-phone-number/${phone.number}`, {
        method: 'PUT',
        body: JSON.stringify({
          nickname: phone.friendly_name,
          inbound_agent_id: phone.inbound_agent_id || null,
          outbound_agent_id: phone.outbound_agent_id || null,
          inbound_webhook_url: webhookUrl
        }),
      });
      
      setPhoneNumbers(phoneNumbers.map(p => 
        p.id === phoneId ? { ...p, inbound_webhook_url: webhookUrl } : p
      ));
      
      toast.success(webhookUrl ? 'Webhook URL updated' : 'Webhook removed');
      return true;
    } catch (error) {
      toast.error('Failed to update webhook');
      console.error(error);
      return false;
    }
  };

  const assignAgent = async (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) {
        console.error("Phone not found with ID:", phoneId);
        return false;
      }
      
      console.log(`Assigning ${direction} agent: ${agentId} to phone: ${phone.number}`);
      
      const updatedData = {
        nickname: phone.friendly_name,
        inbound_agent_id: direction === 'inbound' ? (agentId === "none" ? null : agentId) : (phone.inbound_agent_id || null),
        outbound_agent_id: direction === 'outbound' ? (agentId === "none" ? null : agentId) : (phone.outbound_agent_id || null),
        inbound_webhook_url: phone.inbound_webhook_url || null
      };
      
      await fetchWithAuth(`/update-phone-number/${phone.number}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
      });
      
      setPhoneNumbers(phoneNumbers.map(p => 
        p.id === phoneId ? { 
          ...p, 
          inbound_agent_id: direction === 'inbound' ? (agentId === "none" ? null : agentId) : p.inbound_agent_id,
          outbound_agent_id: direction === 'outbound' ? (agentId === "none" ? null : agentId) : p.outbound_agent_id
        } : p
      ));
      
      toast.success(`${direction.charAt(0).toUpperCase() + direction.slice(1)} agent assigned`);
      return true;
    } catch (error) {
      toast.error(`Failed to assign ${direction} agent`);
      console.error(error);
      return false;
    }
  };

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
