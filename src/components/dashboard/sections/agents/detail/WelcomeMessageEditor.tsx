
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { debounce } from 'lodash';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface WelcomeMessageEditorProps {
  welcomeMessage: string;
  onUpdate: (value: string) => void;
  llmId?: string;
}

// Define the welcome message options
const WELCOME_MESSAGE_OPTIONS = {
  USER_INITIATES: 'User initiates: AI remains silent until users speak first.',
  AI_INITIATES_DYNAMIC: 'AI initiates: AI begins with a dynamic begin message.',
  AI_INITIATES_CUSTOM: 'AI initiates: AI begins with your defined begin message.',
};

const WelcomeMessageEditor: React.FC<WelcomeMessageEditorProps> = ({ 
  welcomeMessage, 
  onUpdate,
  llmId 
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [value, setValue] = useState(welcomeMessage);
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setValue(welcomeMessage);
    
    // Determine which option is selected based on the welcome message value
    if (welcomeMessage === WELCOME_MESSAGE_OPTIONS.USER_INITIATES) {
      setSelectedOption(WELCOME_MESSAGE_OPTIONS.USER_INITIATES);
    } else if (welcomeMessage === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC) {
      setSelectedOption(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC);
    } else {
      setSelectedOption(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM);
    }
  }, [welcomeMessage]);

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
  
  // Create debounced update function for custom message
  const debouncedUpdate = debounce((newValue) => {
    updateWelcomeMessage(WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM, newValue);
  }, 1000);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleSelectChange = (selectedValue: string) => {
    setSelectedOption(selectedValue);
    
    // If the selected option is not custom, update the welcome message directly
    if (selectedValue !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM) {
      setValue(selectedValue);
      updateWelcomeMessage(selectedValue);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-sm font-medium">Welcome Message</span>
        {selectedOption === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Select 
            value={selectedOption} 
            onValueChange={handleSelectChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a welcome message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WELCOME_MESSAGE_OPTIONS.USER_INITIATES}>
                {WELCOME_MESSAGE_OPTIONS.USER_INITIATES}
              </SelectItem>
              <SelectItem value={WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC}>
                {WELCOME_MESSAGE_OPTIONS.AI_INITIATES_DYNAMIC}
              </SelectItem>
              <SelectItem value={WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM}>
                {WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM}
              </SelectItem>
            </SelectContent>
          </Select>
          
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {selectedOption === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM && (
          <>
            {expanded ? (
              <Textarea
                value={value !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM ? value : ''}
                onChange={handleChange}
                className="min-h-[120px] font-mono text-sm border mt-3 rounded focus-visible:ring-0"
                placeholder={t('welcome_message_placeholder')}
                disabled={isLoading}
              />
            ) : (
              <div 
                className="mt-3 p-3 text-sm font-mono cursor-pointer border rounded hover:bg-muted/20"
                onClick={() => setExpanded(true)}
              >
                {value !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM ? value : 'Hello, how can I help you today?'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeMessageEditor;
