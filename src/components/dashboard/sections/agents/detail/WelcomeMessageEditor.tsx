
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
    <div>
      <Textarea
        value={value}
        onChange={handleChange}
        className="min-h-[100px]"
        placeholder={t('welcome_message_placeholder')}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        {t('welcome_message_description')}
      </p>
    </div>
  );
};

export default WelcomeMessageEditor;
