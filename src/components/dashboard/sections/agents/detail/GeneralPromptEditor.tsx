
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GeneralPromptEditorProps {
  generalPrompt: string;
  onUpdate: (value: string) => void;
}

const GeneralPromptEditor: React.FC<GeneralPromptEditorProps> = ({ 
  generalPrompt, 
  onUpdate 
}) => {
  const { t } = useLanguage();
  const [value, setValue] = useState(generalPrompt);
  const [originalValue, setOriginalValue] = useState(generalPrompt);
  const [expanded, setExpanded] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  
  useEffect(() => {
    setValue(generalPrompt);
    setOriginalValue(generalPrompt);
  }, [generalPrompt]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsEdited(newValue !== originalValue);
  };

  const handleSave = () => {
    onUpdate(value);
    setOriginalValue(value);
    setIsEdited(false);
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
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {expanded ? t('collapse') : t('expand')}
        </button>
      </div>
      
      {expanded ? (
        <>
          <Textarea
            value={value}
            onChange={handleChange}
            className="min-h-[200px] font-mono text-sm border-0 rounded-none focus-visible:ring-0"
            placeholder={t('general_prompt_placeholder')}
          />
          {isEdited && (
            <div className="flex justify-end gap-2 p-2 bg-muted/10 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRevert}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                {t('revert')}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {t('save')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div 
          className="p-3 text-sm font-mono cursor-pointer max-h-[300px] overflow-y-auto whitespace-pre-wrap hover:bg-muted/20"
          onClick={() => setExpanded(true)}
        >
          {value || t('no_general_prompt')}
        </div>
      )}
    </div>
  );
};

export default GeneralPromptEditor;
