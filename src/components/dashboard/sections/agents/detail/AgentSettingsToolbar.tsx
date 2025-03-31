
import React from 'react';
import { Globe, Flag } from 'lucide-react';

interface AgentSettingsToolbarProps {
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
}

const AgentSettingsToolbar: React.FC<AgentSettingsToolbarProps> = ({
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <Globe className="h-4 w-4" />
        <select 
          value={selectedLlmModel}
          onChange={(e) => onLlmModelChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm"
        >
          <option value="GPT 4o mini">GPT 4o mini</option>
          <option value="GPT 4o">GPT 4o</option>
          <option value="Claude 3 Opus">Claude 3 Opus</option>
        </select>
      </div>

      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 20v-8"></path><rect x="8" y="2" width="8" height="10" rx="2"></rect>
        </svg>
        <span className="text-sm">Angie vendedora</span>
      </div>

      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <Flag className="h-4 w-4" />
        <select 
          value={defaultLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm"
        >
          <option value="es">Spanish</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
    </div>
  );
};

export default AgentSettingsToolbar;
