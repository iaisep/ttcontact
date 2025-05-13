
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface UseEndCallFormProps {
  agent: RetellAgent;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useEndCallForm = ({ agent, onClose, onSuccess }: UseEndCallFormProps) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [name, setName] = useState("end_call");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
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
      const payload = {
        general_tools: [
          {
            name: name,
            description: description,
            type: "end_call"
          }
        ]
      };
      
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      toast.success(t('end_call_function_added'));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving End Call function:", error);
      toast.error(t('error_adding_end_call_function'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState: {
      name,
      description
    },
    setters: {
      setName,
      setDescription
    },
    isSubmitting,
    handleSubmit
  };
};
