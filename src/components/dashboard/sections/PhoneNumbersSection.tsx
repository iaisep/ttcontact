
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PhoneNumbersList from './phone-numbers/PhoneNumbersList';
import PhoneDetailView from './phone-numbers/PhoneDetailView';

interface PhoneNumber {
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

interface Agent {
  id: string;
  name: string;
}

const PhoneNumbersSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [sipDialogOpen, setSipDialogOpen] = useState(false);
  const [areaCode, setAreaCode] = useState('');

  useEffect(() => {
    fetchPhoneNumbers();
    fetchAgents();
  }, []);

  const fetchPhoneNumbers = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/phone-numbers');
      setPhoneNumbers(data);
      if (data.length > 0 && !selectedPhoneId) {
        setSelectedPhoneId(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch phone numbers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const purchasePhoneNumber = async () => {
    try {
      const newNumber = await fetchWithAuth('/phone-numbers', {
        method: 'POST',
        body: JSON.stringify({ 
          area_code: areaCode || '415',
          country: 'US'
        }),
      });
      setPhoneNumbers([...phoneNumbers, newNumber]);
      setSelectedPhoneId(newNumber.id);
      toast.success('Phone number purchased successfully');
      setPurchaseDialogOpen(false);
      setAreaCode('');
    } catch (error) {
      toast.error('Failed to purchase phone number');
      console.error(error);
    }
  };

  const connectSipNumber = async (sipUri: string, nickname: string) => {
    try {
      // This would be implemented with the right API endpoint
      toast.success('SIP trunking connection will be implemented soon');
      setSipDialogOpen(false);
    } catch (error) {
      toast.error('Failed to connect SIP trunking');
      console.error(error);
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
    } catch (error) {
      toast.error('Failed to release phone number');
      console.error(error);
    }
  };

  const updatePhoneName = async (phoneId: string, name: string) => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) return;
      
      const updatedPhone = await fetchWithAuth(`/update-phone-number/${phone.number}`, {
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
    } catch (error) {
      toast.error('Failed to update phone name');
      console.error(error);
    }
  };

  const updateWebhook = async (phoneId: string, webhookUrl: string | null) => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) return;
      
      const updatedPhone = await fetchWithAuth(`/update-phone-number/${phone.number}`, {
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
    } catch (error) {
      toast.error('Failed to update webhook');
      console.error(error);
    }
  };

  const assignAgent = async (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => {
    try {
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (!phone) return;
      
      const updatedData = {
        nickname: phone.friendly_name,
        inbound_agent_id: direction === 'inbound' ? agentId || null : (phone.inbound_agent_id || null),
        outbound_agent_id: direction === 'outbound' ? agentId || null : (phone.outbound_agent_id || null),
        inbound_webhook_url: phone.inbound_webhook_url || null
      };
      
      const updatedPhone = await fetchWithAuth(`/update-phone-number/${phone.number}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      
      setPhoneNumbers(phoneNumbers.map(p => 
        p.id === phoneId ? { 
          ...p, 
          inbound_agent_id: direction === 'inbound' ? agentId : p.inbound_agent_id,
          outbound_agent_id: direction === 'outbound' ? agentId : p.outbound_agent_id
        } : p
      ));
      
      toast.success(`${direction.charAt(0).toUpperCase() + direction.slice(1)} agent assigned`);
    } catch (error) {
      toast.error(`Failed to assign ${direction} agent`);
      console.error(error);
    }
  };

  const selectedPhone = phoneNumbers.find(phone => phone.id === selectedPhoneId);

  return (
    <div className="h-full">
      <div className="flex border rounded-md overflow-hidden h-full">
        <PhoneNumbersList 
          phoneNumbers={phoneNumbers}
          selectedPhoneId={selectedPhoneId}
          onSelectPhone={(phone) => setSelectedPhoneId(phone.id)}
          onAddClick={() => setPurchaseDialogOpen(true)}
          onBuyNewClick={() => setPurchaseDialogOpen(true)}
          onConnectSIPClick={() => setSipDialogOpen(true)}
        />
        
        <div className="flex-grow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedPhone ? (
            <PhoneDetailView 
              phone={selectedPhone}
              agents={agents}
              onAssignAgent={assignAgent}
              onDeletePhone={releasePhoneNumber}
              onUpdatePhoneName={updatePhoneName}
              onUpdateWebhook={updateWebhook}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h3 className="text-lg font-medium">No phone number selected</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select a phone number from the list or add a new one to configure its settings.
              </p>
              <Button onClick={() => setPurchaseDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Phone Number
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Phone Number Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Purchase Phone Number</DialogTitle>
            <DialogDescription>
              Purchase a new phone number to use with your AI agents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="area-code" className="text-sm font-medium">Area Code</label>
              <Input
                id="area-code"
                placeholder="e.g., 415"
                maxLength={3}
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter a 3-digit area code to find available numbers in that region.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>Cancel</Button>
            <Button onClick={purchasePhoneNumber}>
              Search & Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect SIP Dialog */}
      <Dialog open={sipDialogOpen} onOpenChange={setSipDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Connect via SIP Trunking</DialogTitle>
            <DialogDescription>
              Connect your existing phone number using SIP trunking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="sip-uri" className="text-sm font-medium">SIP URI</label>
              <Input
                id="sip-uri"
                placeholder="sip:username@domain.com"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sip-name" className="text-sm font-medium">Display Name</label>
              <Input
                id="sip-name"
                placeholder="My SIP Number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSipDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => connectSipNumber("", "")}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneNumbersSection;
