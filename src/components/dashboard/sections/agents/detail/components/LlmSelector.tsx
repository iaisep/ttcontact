
import React, { useState } from 'react';
import { Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface LlmSelectorProps {
  llmId: string | undefined;
  selectedModel: string;
  onLlmChange: (llmId: string) => void;
  onSettingsClick: () => void;
}

// OpenAI LLM options
const LLM_OPTIONS = [
  { id: 'gpt-4o-mini', name: 'GPT 4o mini', provider: 'openai' },
  { id: 'gpt-4o', name: 'GPT 4o', provider: 'openai' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
];

const LlmSelector: React.FC<LlmSelectorProps> = ({ llmId, selectedModel, onLlmChange, onSettingsClick }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLlmChange = async (newLlmId: string) => {
    if (newLlmId === selectedModel) return;
    
    setIsUpdating(true);
    try {
      // Ensure we have the current LLM ID from the agent
      const currentLlmId = llmId || '';
      
      // Update the LLM with the correct payload format
      await fetchWithAuth(`/update-retell-llm/${currentLlmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          model: newLlmId,
          s2s_model: null
        })
      });
      
      // Fetch the updated LLM info to get the latest model
      const updatedLlm = await fetchWithAuth(`/get-retell-llm/${currentLlmId}`);
      
      // Use the model from the response, fallback to selected if not found
      const updatedModel = updatedLlm?.model || newLlmId;
      
      // Call the onLlmChange callback with the updated model
      onLlmChange(updatedModel);
      
      toast.success(t('llm_updated_successfully'));
    } catch (error) {
      console.error('Error updating LLM:', error);
      toast.error(t('error_updating_llm'));
    } finally {
      setIsUpdating(false);
    }
  };

  // Find the current LLM details
  const currentLlm = LLM_OPTIONS.find(option => option.id === selectedModel) || { 
    id: selectedModel || '', 
    name: selectedModel || 'Select LLM', 
    provider: '' 
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-between w-full max-w-full gap-1 sm:gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto overflow-hidden"
    >
      <div className="flex items-center gap-1 sm:gap-2 overflow-hidden flex-wrap">
        <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full flex-shrink-0 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 sm:h-5 sm:w-5 text-gray-700 flex-shrink-0" />
        </div>
        <span className="truncate text-[10px] :text-[10px] max-w-[100px] sm:max-w-[120px]">{currentLlm.name}</span>
      </div>
      
      <div className="flex items-center flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUpdating}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-6 sm:w-6 p-0 flex-shrink-0"
            >
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] z-50 bg-white">
            {LLM_OPTIONS.map((option) => (
              <DropdownMenuItem 
                key={option.id}
                onClick={() => handleLlmChange(option.id)}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-600" />
                <span className="truncate">{option.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick();
          }}
          className="h-6 w-6 sm:h-6 sm:w-6 p-0 flex-shrink-0"
        >
          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
        </Button>
      </div>
    </Button>
  );
};

export default LlmSelector;
