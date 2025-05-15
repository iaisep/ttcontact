
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { ContactData } from './useCsvProcessor';

export const useBatchCall = (onStartBatch: () => void) => {
  const { fetchWithAuth } = useApiContext();
  const [processingBatchCall, setProcessingBatchCall] = useState<boolean>(false);

  const startBatchCall = async (selectedPhoneNumber: string, contacts: ContactData[]) => {
    if (!selectedPhoneNumber) {
      toast.error('Please select a phone number');
      return;
    }

    setProcessingBatchCall(true);
    try {
      const tasks = contacts.map(contact => ({
        to_number: contact.phone,
        variables: contact.variables || {}
      }));

      console.log('Creating batch call with contacts:', tasks);

      const payload = {
        name: "",
        from_number: selectedPhoneNumber,
        status: "planned",
        timezone: "America/Sao_Paulo",
        tasks: tasks
      };

      const response = await fetchWithAuth('/create-batch-call', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Batch call created:', response);
      toast.success(`Batch call successfully created with ${tasks.length} contacts`);
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
    startBatchCall
  };
};
