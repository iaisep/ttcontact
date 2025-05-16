
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { Agent } from './types';
import { ContactData } from './hooks/useCsvProcessor';
import { usePhoneNumbers } from './hooks/usePhoneNumbers';
import { useBatchCall } from './hooks/useBatchCall';
import PhoneNumberSelect from './components/PhoneNumberSelect';

interface AgentSelectionStepProps {
  agents: Agent[];
  selectedAgent: string;
  setSelectedAgent: (agentId: string) => void;
  onBack: () => void;
  onStartBatch: () => void;
  loading: boolean;
}

const AgentSelectionStep = ({
  selectedAgent,
  setSelectedAgent,
  onBack,
  onStartBatch,
  loading,
}: AgentSelectionStepProps) => {
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>('');

  const {
    phoneNumbers,
    fetchingPhoneNumbers,
    phoneNumberError,
    fetchPhoneNumbers
  } = usePhoneNumbers(selectedPhoneNumber, setSelectedAgent);

  const {
    processingBatchCall,
    startBatchCall
  } = useBatchCall(onStartBatch);

  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log('Phone number selected:', phoneNumber);
    setSelectedPhoneNumber(phoneNumber);

    const selectedPhone = phoneNumbers.find(phone => phone.phone_number === phoneNumber);
    if (selectedPhone) {
      console.log('Setting selected agent to:', selectedPhone.outbound_agent_id);
      setSelectedAgent(selectedPhone.outbound_agent_id);
    }
  };

  // ✅ Solo se desactiva si no hay número, o si está cargando, o si está procesando
  const isButtonDisabled =
    !selectedPhoneNumber ||
    fetchingPhoneNumbers ||
    processingBatchCall;

  // Log de depuración
  useEffect(() => {
    console.log('Button state:', {
      selectedPhoneNumber,
      fetchingPhoneNumbers,
      processingBatchCall,
      isButtonDisabled
    });
  }, [selectedPhoneNumber, fetchingPhoneNumbers, processingBatchCall, isButtonDisabled]);

  return (
    <div className="space-y-4">
      <PhoneNumberSelect
        fetchingPhoneNumbers={fetchingPhoneNumbers}
        phoneNumbers={phoneNumbers}
        selectedPhoneNumber={selectedPhoneNumber}
        onPhoneNumberChange={handlePhoneNumberChange}
        onRefresh={fetchPhoneNumbers}
        phoneNumberError={phoneNumberError}
      />

      <div className="flex items-center space-x-2 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => startBatchCall(selectedPhoneNumber, [])}
          disabled={isButtonDisabled}
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
