import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { AgentFunction } from '../types';

interface UseCallTransferFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AgentFunction; // Add initialData prop for editing mode
}

export const useCallTransferForm = ({ agent, onClose, onSuccess, initialData }: UseCallTransferFormProps) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default form state
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
  const [error, setError] = useState<string | null>(null);

  // Initialize form with the initialData if provided
  useEffect(() => {
    if (initialData && initialData.type === 'transfer_call') {
      // Set basic function properties
      setFunctionName(initialData.name || 'transfer_call');
      setDescription(initialData.description || '');

      // Set transfer destination properties
      if (initialData.transfer_destination) {
        // Determine transfer method
        if (initialData.transfer_destination.type === 'predefined') {
          setTransferMethod('static');
          setPhoneNumber(initialData.transfer_destination.number || '');
        } else if (initialData.transfer_destination.type === 'inferred') {
          setTransferMethod('dynamic');
          // Use routing_prompt instead of prompt
          setDynamicRouting(initialData.transfer_destination.routing_prompt || '');
        }
      }

      // Set handoff message properties
      if (initialData.handoff_message) {
        setTransferType('warm');
        setMessageType(initialData.handoff_message.type || 'prompt');
        setHandoffMessage(initialData.handoff_message.content || '');
      } else {
        setTransferType('cold');
      }
    }
  }, [initialData]);

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
    setError(null);

    try {
      // First, fetch existing tools to preserve them
      const llmResponse = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      const existingTools = llmResponse.general_tools || [];
      
      // Check if we're updating an existing function
      let updatedTools;
      if (initialData) {
        // Filter out the function we're editing and add the updated one
        updatedTools = existingTools.filter((tool: any) => tool.name !== initialData.name);
      } else {
        // Check if function name already exists
        const nameExists = existingTools.some((tool: any) => tool.name === functionName);
        if (nameExists) {
          setError(`Tool name must be unique across general tools + tools of the state + state transitions. Duplicate name found: ${functionName}`);
          toast.error(`Function name "${functionName}" already exists`);
          setIsSubmitting(false);
          return;
        }
        updatedTools = [...existingTools];
      }

      // Prepare the function data based on transfer method
      let transferDestination;
      if (transferMethod === 'static') {
        transferDestination = {
          type: "predefined",
          number: phoneNumber
        };
      } else {
        // Use "inferred" type with "routing_prompt" field for dynamic routing
        transferDestination = {
          type: "inferred",
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
      
      // Add the new or updated function to tools array
      updatedTools.push(functionData);
      
      // Update the LLM with all functions
      const response = await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedTools })
      });

      // Check if there's an error response with a specific message pattern
      if (response && response.status === 'error' && response.message && response.message.includes('Duplicate name found')) {
        setError(response.message);
        toast.error(`Function name "${functionName}" already exists`);
        setIsSubmitting(false);
        return;
      }

      toast.success(initialData ? t('call_transfer_function_updated') : t('call_transfer_function_added'));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error handling call transfer function:', error);
      
      // Check if the error is related to duplicate function name
      if (error.message && typeof error.message === 'string' && error.message.includes('Duplicate name found')) {
        setError(error.message);
        toast.error(`Function name "${functionName}" already exists`);
      } else {
        toast.error(initialData ? t('error_updating_call_transfer_function') : t('error_adding_call_transfer_function'));
        setError(error.message || (initialData ? t('error_updating_call_transfer_function') : t('error_adding_call_transfer_function')));
      }
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
    error,
    handleSubmit
  };
};
