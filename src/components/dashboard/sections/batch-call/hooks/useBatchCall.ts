import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { ContactData } from './useCsvProcessor';

export const useBatchCall = (onStartBatch: () => void) => {
  const { fetchWithAuth } = useApiContext();
  const [processingBatchCall, setProcessingBatchCall] = useState<boolean>(false);
  const [contacts, setContacts] = useState<ContactData[]>([]);

  const handleFileUpload = (file: File) => {
    // ...parsea el archivo y llama a setContacts(parsedContacts)
  };

  const cleanVariables = (vars: any) => {
    const cleaned: Record<string, string> = {};
    Object.entries(vars).forEach(([key, value]) => {
      // Solo agrega si ambos son strings y limpia el valor
      if (typeof key === 'string' && typeof value === 'string') {
        cleaned[key.trim()] = value.replace(' (optional)', '').trim();
      }
    });
    return cleaned;
  };

  const startBatchCall = async (selectedPhoneNumber: string, contacts: ContactData[]) => {
    if (!selectedPhoneNumber) {
      toast.error('Please select a phone number');
      return;
    }

    setProcessingBatchCall(true);
    try {
      // Encuentra la clave de CSV más reciente
      const csvKeys = Object.keys(localStorage).filter(key => key.endsWith('.csv'));
      const csvKey = csvKeys.length > 0 ? csvKeys[csvKeys.length - 1] : null;

      let storedContacts: any[] = [];
      if (csvKey) {
        const storedData = localStorage.getItem(csvKey);
        if (storedData) {
          try {
            storedContacts = JSON.parse(storedData);
          } catch (e) {
            console.warn(`Error parsing storage for ${csvKey}:`, e);
          }
        }
      }

      const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

      const tasks = storedContacts.map(contact => {
        let variables = {};
        if (contact.variables) {
          if (typeof contact.variables === 'string') {
            try {
              variables = JSON.parse(contact.variables);
            } catch (e) {
              console.warn('Error parsing variables for contact', contact.phone, e);
            }
          } else if (typeof contact.variables === 'object') {
            variables = contact.variables;
          }
        }

        return {
          to_number: contact.phone,
          ...cleanVariables(variables) // <-- Expande las variables aquí
        };
      });

      console.log('contacts:', contacts);
      console.log('storedContacts:', storedContacts);
      console.log('tasks:', tasks);

      console.log('Creating batch call with contacts:', tasks);

      const payload = {
        name: "",
        from_number: selectedPhoneNumber,
        status: "planned",
        timezone: "America/Sao_Paulo",
        tasks: tasks
      };

      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await fetchWithAuth('/create-batch-call', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Batch call created:', response);
      toast.success(`Batch call successfully created with ${tasks.length} contacts`);
      if (csvKey) {
        localStorage.removeItem(csvKey);
      }
      onStartBatch();
    } catch (error) {
      console.error('Failed to create batch call:', error);
      toast.error('Failed to create batch call');
    } finally {
      setProcessingBatchCall(false);
    }
  };

  return {
    processingBatchCall,
    startBatchCall,
    contacts,
    setContacts,
    handleFileUpload
  };
};
