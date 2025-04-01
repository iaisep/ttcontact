
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Model pricing information mapped to model names
const MODEL_PRICING: Record<string, string> = {
  'GPT 4o': '($0.05/min)',
  'GPT 4o Realtime': '($0.5/min)',
  'GPT 4o mini': '($0.00s/min)',
  'GPT 4o mini Realtime': '($0.125/min)',
  'Claude 3.7 Sonnet': '($0.06/min)',
  'Claude 3.5 Haiku': '($0.02/min)',
};

interface LlmSelectorProps {
  selectedLlmModel: string;
  llmOptions: string[];
  handleLlmChange: (llm: string) => void;
  isLoadingLlmOptions?: boolean;
}

const LlmSelector: React.FC<LlmSelectorProps> = ({
  selectedLlmModel,
  llmOptions,
  handleLlmChange,
  isLoadingLlmOptions = false,
}) => {
  // Add pricing information to model name
  const getModelWithPricing = (model: string) => {
    const pricing = MODEL_PRICING[model] || '';
    return pricing ? `${model} ${pricing}` : model;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
          {isLoadingLlmOptions ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>{selectedLlmModel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="bg-white w-64 shadow-lg border border-gray-200 z-50 rounded-md"
        sideOffset={5}
        avoidCollisions={true}
      >
        {isLoadingLlmOptions ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Loading models...</span>
          </div>
        ) : (
          llmOptions.map((option) => (
            <DropdownMenuItem 
              key={option} 
              onClick={() => handleLlmChange(option)}
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-600" />
                <div>
                  <div className="font-medium">{option}</div>
                  <div className="text-xs text-gray-500">{MODEL_PRICING[option] || ''}</div>
                </div>
              </div>
              {selectedLlmModel === option && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LlmSelector;
