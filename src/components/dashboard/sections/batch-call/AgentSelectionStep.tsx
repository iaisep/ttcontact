
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { Agent } from './types';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface PhoneNumberData {
  id: string;
  phone_number: string;
  phone_number_type: string;
  phone_number_pretty: string;
  nickname: string;
  friendly_name: string;
  outbound_agent_id: string;
  inbound_agent_id: string;
}

interface AgentSelectionStepProps {
  agents: Agent[];
  selectedAgent: string;
  setSelectedAgent: (agentId: string) => void;
  onBack: () => void;
  onStartBatch: () => void;
  loading: boolean;
}

const AgentSelectionStep = ({
  agents,
  selectedAgent,
  setSelectedAgent,
  onBack,
  onStartBatch,
  loading,
}: AgentSelectionStepProps) => {
  const { fetchWithAuth } = useApiContext();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberData[]>([]);
  const [fetchingPhoneNumbers, setFetchingPhoneNumbers] = useState<boolean>(true);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>('');

  const fetchPhoneNumbers = async () => {
    setFetchingPhoneNumbers(true);
    setPhoneNumberError(null);
    try {
      const data = await fetchWithAuth('/list-phone-numbers');
      console.log('Fetched phone numbers:', data);
      
      if (Array.isArray(data)) {
        // Filter phone numbers that have an outbound agent assigned
        const phonesWithAgents = data.filter(phone => phone.outbound_agent_id);
        setPhoneNumbers(phonesWithAgents);
        
        // If we have phone numbers with agents and no phone number is selected yet, select the first one
        if (phonesWithAgents.length > 0 && !selectedPhoneNumber) {
          const firstPhone = phonesWithAgents[0];
          setSelectedPhoneNumber(firstPhone.phone_number);
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
    }
  };

  // Fetch phone numbers on component mount
  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Find the corresponding phone number object
    const selectedPhone = phoneNumbers.find(phone => phone.phone_number === phoneNumber);
    
    // Update both states
    setSelectedPhoneNumber(phoneNumber);
    
    // Only update the agent if we found a matching phone number
    if (selectedPhone) {
      setSelectedAgent(selectedPhone.outbound_agent_id);
    }
  };

  const handleRefresh = () => {
    fetchPhoneNumbers();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="agent-select">Select Phone Number with Agent</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={fetchingPhoneNumbers}
          >
            {fetchingPhoneNumbers ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <select
          id="agent-select"
          value={selectedPhoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          disabled={fetchingPhoneNumbers || phoneNumbers.length === 0}
        >
          {fetchingPhoneNumbers ? (
            <option value="">Loading...</option>
          ) : phoneNumbers.length === 0 ? (
            <option value="" disabled>No phone numbers available</option>
          ) : (
            <>
              <option value="">Select a phone number</option>
              {phoneNumbers.map((phone) => (
                <option key={phone.id || phone.phone_number} value={phone.phone_number}>
                  {phone.phone_number_pretty || phone.phone_number} ({phone.nickname || phone.friendly_name})
                </option>
              ))}
            </>
          )}
        </select>
        
        {phoneNumberError && (
          <p className="text-xs text-destructive">{phoneNumberError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="call-variables">Call Variables (Optional)</Label>
        <Textarea
          id="call-variables"
          placeholder="Enter any global variables for all calls in JSON format"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Variables defined here will be available to all calls, but can be overridden by per-contact variables.
        </p>
      </div>
      
      <div className="flex items-center space-x-2 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onStartBatch} disabled={!selectedAgent || loading || fetchingPhoneNumbers}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Batch Calls
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AgentSelectionStep;
