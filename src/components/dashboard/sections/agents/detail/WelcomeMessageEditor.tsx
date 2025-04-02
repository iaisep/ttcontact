
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';
import {
  WelcomeMessageOptions,
  CustomMessageEditor,
  LoadingState,
  useWelcomeMessage,
  WELCOME_MESSAGE_OPTIONS
} from './welcome-message';

interface WelcomeMessageEditorProps {
  welcomeMessage: string;
  onUpdate: (value: string) => void;
  llmId?: string;
}

const WelcomeMessageEditor: React.FC<WelcomeMessageEditorProps> = ({ 
  welcomeMessage, 
  onUpdate,
  llmId 
}) => {
  const { t } = useLanguage();
  
  const {
    value,
    expanded,
    setExpanded,
    selectedOption,
    isLoading,
    initialLoading,
    handleChange,
    handleBlur,
    handleSelectChange
  } = useWelcomeMessage({
    welcomeMessage,
    onUpdate,
    llmId
  });

  if (initialLoading) {
    return <LoadingState />;
  }

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
          <WelcomeMessageOptions
            selectedOption={selectedOption}
            handleSelectChange={handleSelectChange}
            isLoading={isLoading}
          />
          
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {selectedOption === WELCOME_MESSAGE_OPTIONS.AI_INITIATES_CUSTOM && (
          <CustomMessageEditor
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            expanded={expanded}
            setExpanded={setExpanded}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default WelcomeMessageEditor;
