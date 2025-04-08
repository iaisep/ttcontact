
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumber } from './types';

export const useAgentAssignment = (
  phoneNumbers: PhoneNumber[],
  setPhoneNumbers: (phones: PhoneNumber[]) => void
) => {
  const { fetchWithAuth } = useApiContext();

  const assignAgent = async (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) {
        console.error("Phone not found with ID:", phoneId);
        return false;
      }
      
      console.log(`Assigning ${direction} agent: ${agentId} to phone: ${phone.number}`);
      
      // Prepare the data for the API request
      const updatedData = {
        nickname: phone.friendly_name || phone.nickname,
        inbound_agent_id: direction === 'inbound' 
          ? (agentId === "none" ? null : agentId) 
          : (phone.inbound_agent_id || null),
        outbound_agent_id: direction === 'outbound' 
          ? (agentId === "none" ? null : agentId) 
          : (phone.outbound_agent_id || null),
        inbound_webhook_url: phone.inbound_webhook_url || null
      };
      
      console.log('Sending update data:', updatedData);
      
      // Send the update request to the API
      const response = await fetchWithAuth(`/update-phone-number/${phone.number}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
      });
      
      console.log('API response:', response);
      
      // Update the local state with the new agent assignment
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
      console.error(`Failed to assign ${direction} agent:`, error);
      toast.error(`Failed to assign ${direction} agent`);
      return false;
    }
  };

  return { assignAgent };
};
