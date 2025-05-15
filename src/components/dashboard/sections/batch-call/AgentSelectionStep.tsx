
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
  const [contacts, setContacts] = useState<ContactData[]>([]);

  // Inicializar el hook usePhoneNumbers con el estado de selectedPhoneNumber
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

  // Cargar los contactos desde localStorage solo una vez al iniciar
  useEffect(() => {
    console.log('AgentSelectionStep: Loading contacts from localStorage');
    const storedContacts = localStorage.getItem('batch_call_contacts');
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        setContacts(parsedContacts);
        console.log('Loaded contacts from localStorage:', parsedContacts.length);
      } catch (error) {
        console.error('Failed to parse contacts from localStorage:', error);
      }
    }
  }, []);

  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log('Phone number selected:', phoneNumber);
    setSelectedPhoneNumber(phoneNumber);
    
    const selectedPhone = phoneNumbers.find(phone => phone.phone_number === phoneNumber);
    if (selectedPhone) {
      console.log('Setting selected agent to:', selectedPhone.outbound_agent_id);
      setSelectedAgent(selectedPhone.outbound_agent_id);
    }
  };

  // El botón debe estar deshabilitado si no hay un número de teléfono seleccionado,
  // si estamos cargando los números de teléfono, si estamos procesando la llamada por lotes,
  // o si no hay contactos
  const isButtonDisabled = !selectedPhoneNumber || 
                          fetchingPhoneNumbers || 
                          processingBatchCall || 
                          contacts.length === 0;

  // Log para depuración del estado del botón
  useEffect(() => {
    console.log('Button state:', {
      selectedPhoneNumber,
      fetchingPhoneNumbers,
      processingBatchCall,
      contactsLength: contacts.length,
      isButtonDisabled
    });
  }, [selectedPhoneNumber, fetchingPhoneNumbers, processingBatchCall, contacts.length, isButtonDisabled]);

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
          onClick={() => startBatchCall(selectedPhoneNumber, contacts)} 
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
