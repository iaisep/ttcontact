
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface GeneralPromptEditorProps {
  generalPrompt: string;
  onUpdate: (value: string) => void;
  llmId?: string;
}

const GeneralPromptEditor: React.FC<GeneralPromptEditorProps> = ({ 
  generalPrompt, 
  onUpdate,
  llmId
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [value, setValue] = useState(generalPrompt || '');
  const [originalValue, setOriginalValue] = useState(generalPrompt || '');
  const [expanded, setExpanded] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    // Update value when generalPrompt prop changes, but handle null/undefined cases
    const newValue = generalPrompt || '';
    setValue(newValue);
    setOriginalValue(newValue);
  }, [generalPrompt]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsEdited(newValue !== originalValue);
  };

  const handleSave = async () => {
    if (!llmId) {
      toast.error(t('llm_id_missing'));
      return;
    }

    setIsUpdating(true);
    try {
      // Use the correct API endpoint and payload structure
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          general_prompt: value
        })
      });
      
      // Update local state to reflect changes
      setOriginalValue(value);
      setIsEdited(false);
      
      // Call the parent callback to update the parent component
      onUpdate(value);
      toast.success(t('general_prompt_updated'));
    } catch (error) {
      console.error('Failed to update general prompt:', error);
      toast.error(t('error_updating_general_prompt'));
      
      // Revert to original value on error
      setValue(originalValue);
      setIsEdited(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevert = () => {
    setValue(originalValue);
    setIsEdited(false);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-sm font-medium">{t('llm_general_prompt')}</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          {expanded ? t('collapse') : t('expand')}
        </button>
      </div>
      
      {expanded ? (
        <>
          <Textarea
            value={value}
            onChange={handleChange}
            className="min-h-[200px] font-mono text-[10px] border-0 rounded-none focus-visible:ring-0"
            placeholder={t('general_prompt_placeholder')}
            disabled={isUpdating}
          />
          {isEdited && (
            <div className="flex justify-end gap-2 p-2 bg-muted/10 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRevert}
                className="text-xs"
                disabled={isUpdating}
              >
                <X className="h-3 w-3 mr-1" />
                {t('revert')}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                className="text-xs"
                disabled={isUpdating}
              >
                <Check className="h-3 w-3 mr-1" />
                {isUpdating ? t('saving') : t('save')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div 
          className="p-3 text-[10px] font-mono cursor-pointer max-h-[300px] overflow-y-auto whitespace-pre-wrap hover:bg-muted/20"
          onClick={() => setExpanded(true)}
        >
          {value || t('no_general_prompt')}
        </div>
      )}
    </div>
  );
};

export default GeneralPromptEditor;
