
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { Agent } from './types';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { ContactData } from './hooks/useCsvProcessor';

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
  const [processingBatchCall, setProcessingBatchCall] = useState<boolean>(false);
  const [contacts, setContacts] = useState<ContactData[]>([]);

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
    
    // Load contacts from localStorage
    const storedContacts = localStorage.getItem('batch_call_contacts');
    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (error) {
        console.error('Failed to parse contacts from localStorage:', error);
      }
    }
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

  const startBatchCall = async () => {
    if (!selectedPhoneNumber) {
      toast.error('Please select a phone number');
      return;
    }

    if (!contacts || contacts.length === 0) {
      toast.error('No contacts found in the CSV file. Please upload a valid file first.');
      return;
    }

    setProcessingBatchCall(true);
    try {
      // Prepare the tasks array from the contacts
      const tasks = contacts.map(contact => ({
        to_number: contact.phone,
        variables: contact.variables || {}
      }));

      console.log('Creating batch call with contacts:', tasks);

      // Prepare the payload for the batch call
      const payload = {
        name: "",
        from_number: selectedPhoneNumber,
        status: "planned",
        timezone: "America/Sao_Paulo",
        tasks: tasks
      };

      // Make the API call
      const response = await fetchWithAuth('/create-batch-call', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Batch call created:', response);
      toast.success(`Batch call successfully created with ${tasks.length} contacts`);
      onStartBatch(); // Notify parent component
    } catch (error) {
      console.error('Failed to create batch call:', error);
      toast.error('Failed to create batch call');
    } finally {
      setProcessingBatchCall(false);
    }
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

      {contacts && contacts.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Contacts from CSV ({contacts.length})</p>
          <p className="text-xs text-muted-foreground">
            The batch call will be made to these phone numbers
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={startBatchCall} 
          disabled={!selectedPhoneNumber || fetchingPhoneNumbers || processingBatchCall || contacts.length === 0}
        >
          {processingBatchCall ? (
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
