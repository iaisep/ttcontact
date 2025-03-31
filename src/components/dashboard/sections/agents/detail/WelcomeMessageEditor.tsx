
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { debounce } from 'lodash';

interface WelcomeMessageEditorProps {
  welcomeMessage: string;
  onUpdate: (value: string) => void;
}

const WelcomeMessageEditor: React.FC<WelcomeMessageEditorProps> = ({ welcomeMessage, onUpdate }) => {
  const { t } = useLanguage();
  const [value, setValue] = useState(welcomeMessage);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    setValue(welcomeMessage);
  }, [welcomeMessage]);

  // Create debounced update function
  const debouncedUpdate = debounce((value) => onUpdate(value), 1000);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-sm font-medium">Welcome Message</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {expanded ? (
        <Textarea
          value={value}
          onChange={handleChange}
          className="min-h-[120px] font-mono text-sm border-0 rounded-none focus-visible:ring-0"
          placeholder={t('welcome_message_placeholder')}
        />
      ) : (
        <div 
          className="p-3 text-sm font-mono cursor-pointer hover:bg-muted/20"
          onClick={() => setExpanded(true)}
        >
          {value || 'Hola {name}, que gusto volver a saludarte.'}
        </div>
      )}
    </div>
  );
};

export default WelcomeMessageEditor;
