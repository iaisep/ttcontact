
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { PhoneNumber } from './types';

export const usePhoneNumberSettings = (
  phoneNumbers: PhoneNumber[],
  setPhoneNumbers: (phones: PhoneNumber[]) => void
) => {
  const { fetchWithAuth } = useApiContext();

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

  return {
    updatePhoneName,
    updateWebhook
  };
};
