
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Phone } from 'lucide-react';
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
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setDialogOpen(false);
      setAreaCode('');
    } catch (error) {
      toast.error('Failed to purchase phone number');
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

  const assignAgent = async (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => {
    try {
      const updatedPhone = await fetchWithAuth(`/phone-numbers/${phoneId}/assign-agent`, {
        method: 'PUT',
        body: JSON.stringify({ agent_id: agentId, direction }),
      });
      
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === phoneId ? { ...phone, agent_id: agentId } : phone
      ));
      
      toast.success(`${direction.charAt(0).toUpperCase() + direction.slice(1)} agent assigned`);
    } catch (error) {
      toast.error(`Failed to assign ${direction} agent`);
      console.error(error);
    }
  };

  const selectedPhone = phoneNumbers.find(phone => phone.id === selectedPhoneId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Phone Numbers</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Phone Number
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex border rounded-md overflow-hidden">
          <PhoneNumbersList 
            phoneNumbers={phoneNumbers}
            selectedPhoneId={selectedPhoneId}
            onSelectPhone={(phone) => setSelectedPhoneId(phone.id)}
          />
          
          <div className="flex-grow p-6">
            {selectedPhone ? (
              <PhoneDetailView 
                phone={selectedPhone}
                agents={agents}
                onAssignAgent={assignAgent}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No phone number selected</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Select a phone number from the list or purchase a new one to configure its settings.
                </p>
                <Button onClick={() => setDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Phone Number
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={purchasePhoneNumber}>
              Search & Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneNumbersSection;
