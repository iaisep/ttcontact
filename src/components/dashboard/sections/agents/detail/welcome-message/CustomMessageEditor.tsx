
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { WELCOME_MESSAGE_OPTIONS } from './WelcomeMessageOptions';

interface CustomMessageEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  isLoading: boolean;
}

const CustomMessageEditor: React.FC<CustomMessageEditorProps> = ({
  value,
  onChange,
  onBlur,
  expanded,
  setExpanded,
  isLoading,
}) => {
  const { t } = useLanguage();

  if (!expanded) {
    return (
      <div 
        className="mt-3 p-3 text-sm font-mono cursor-pointer border rounded hover:bg-muted/20"
        onClick={() => setExpanded(true)}
      >
        {value !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM ? value : 'Hello, how can I help you today?'}
      </div>
    );
  }

  return (
    <Textarea
      value={value !== WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM ? value : ''}
      onChange={onChange}
      onBlur={onBlur}
      className="min-h-[120px] font-mono text-sm border mt-3 rounded focus-visible:ring-0"
      placeholder={t('welcome_message_placeholder')}
      disabled={isLoading}
    />
  );
};

export default CustomMessageEditor;
