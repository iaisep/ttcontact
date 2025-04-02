
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { WELCOME_MESSAGE_OPTIONS } from './WelcomeMessageOptions';

interface UseWelcomeMessageProps {
  welcomeMessage: string;
  onUpdate: (value: string) => void;
  llmId?: string;
}

export const useWelcomeMessage = ({ welcomeMessage, onUpdate, llmId }: UseWelcomeMessageProps) => {
  const { fetchWithAuth } = useApiContext();
  const [value, setValue] = useState(welcomeMessage);
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial LLM data to get the actual begin_message value
  useEffect(() => {
    const fetchLlmData = async () => {
      if (!llmId) {
        setInitialLoading(false);
        return;
      }
      
      try {
        setInitialLoading(true);
        const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
        
        // Determine which option to select based on the begin_message value
        if (llmData) {
          if (llmData.begin_message === "") {
            setSelectedOption(WELCOME_MESSAGE_OPTIONS.USER_INITIATES);
            setValue(WELCOME_MESSAGE_OPTIONS.USER_INITIATES);
          } else if (llmData.begin_message === null) {
            setSelectedOption(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC);
            setValue(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC);
          } else {
            setSelectedOption(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM);
            setValue(llmData.begin_message || "Hello, how can I help you today?");
          }
        }
      } catch (error) {
        console.error('Error fetching LLM data:', error);
        toast.error('Could not load welcome message settings');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchLlmData();
  }, [llmId, fetchWithAuth]);

  const updateWelcomeMessage = async (option: string, customMessage?: string) => {
    if (!llmId) {
      console.error('LLM ID is required to update welcome message');
      toast.error('Could not update welcome message: Missing LLM ID');
      return;
    }

    setIsLoading(true);
    try {
      let payload;
      
      if (option === WELCOME_MESSAGE_OPTIONS.USER_INITIATES) {
        payload = { begin_message: "" };
      } else if (option === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC) {
        payload = { begin_message: null };
      } else {
        // For custom message option
        payload = { begin_message: customMessage || "Hello, how can I help you today?" };
      }
      
      // Make the API call to update the LLM's welcome message
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      // Update local state
      onUpdate(option === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM && customMessage 
        ? customMessage 
        : option);
      
      toast.success('Welcome message updated successfully');
    } catch (error) {
      console.error('Error updating welcome message:', error);
      toast.error('Failed to update welcome message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    if (selectedOption === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM) {
      updateWelcomeMessage(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM, value);
    }
  };

  const handleSelectChange = (selectedValue: string) => {
    setSelectedOption(selectedValue);
    
    // If the selected option is not custom, update the welcome message directly
    if (selectedValue !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM) {
      setValue(selectedValue);
      updateWelcomeMessage(selectedValue);
    }
  };

  return {
    value,
    setValue,
    expanded,
    setExpanded,
    selectedOption,
    setSelectedOption,
    isLoading,
    setIsLoading,
    initialLoading,
    handleChange,
    handleBlur,
    handleSelectChange
  };
};
