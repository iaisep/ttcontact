
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface UseCallTransferFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useCallTransferForm = ({ agent, onClose, onSuccess }: UseCallTransferFormProps) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [functionName, setFunctionName] = useState('transfer_call');
  const [description, setDescription] = useState('Transfer the call to a human agent');
  const [transferMethod, setTransferMethod] = useState('static');
  const [phoneNumber, setPhoneNumber] = useState('+14154154155');
  const [dynamicRouting, setDynamicRouting] = useState(
    'If the user wants to reach support, transfer to +1 (925) 222-2222; if the user wants to reach sales, transfer to +1 (925) 333-3333'
  );
  const [transferType, setTransferType] = useState('cold');
  const [messageType, setMessageType] = useState('prompt');
  const [handoffMessage, setHandoffMessage] = useState('Say hello to the agent and summarize the user problem to him');

  const handleSubmit = async () => {
    if (!functionName.trim()) {
      toast.error(t('function_name_required'));
      return;
    }

    const llmId = agent?.response_engine?.llm_id;
    if (!llmId) {
      toast.error(t('no_llm_id_found'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the function data based on transfer method
      let transferDestination;
      if (transferMethod === 'static') {
        transferDestination = {
          type: "predefined",
          number: phoneNumber
        };
      } else {
        transferDestination = {
          type: "dynamic",
          routing_prompt: dynamicRouting
        };
      }
          
      // Prepare handoff message configuration based on transfer type and message type
      let handoffConfig = undefined;
      if (transferType === 'warm') {
        handoffConfig = {
          type: messageType,
          content: handoffMessage
        };
      }

      // Create the function payload
      const functionData = {
        name: functionName,
        description: description,
        type: "transfer_call",
        transfer_destination: transferDestination,
        show_transferee_as_caller: false,
        ...(handoffConfig && { handoff_message: handoffConfig })
      };

      // Get existing functions first
      const llmResponse = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      const existingTools = llmResponse.general_tools || [];
      
      // Add the new function
      const updatedTools = [...existingTools, functionData];
      
      // Update the LLM with the new function
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedTools })
      });

      toast.success(t('call_transfer_function_added'));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding call transfer function:', error);
      toast.error(t('error_adding_call_transfer_function'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState: {
      functionName,
      description,
      transferMethod,
      phoneNumber,
      dynamicRouting,
      transferType,
      messageType,
      handoffMessage
    },
    setters: {
      setFunctionName,
      setDescription,
      setTransferMethod,
      setPhoneNumber,
      setDynamicRouting,
      setTransferType,
      setMessageType,
      setHandoffMessage
    },
    isSubmitting,
    handleSubmit
  };
};
