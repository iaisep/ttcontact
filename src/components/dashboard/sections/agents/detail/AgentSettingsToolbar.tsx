
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Idioma:</span>
        <Select 
          value={defaultLanguage} 
          onValueChange={onLanguageChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Seleccionar idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgentSettingsToolbar;
