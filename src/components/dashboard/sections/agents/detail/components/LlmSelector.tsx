
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenuContent align="start" className="bg-white">
        {isLoadingLlmOptions ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Loading models...</span>
          </div>
        ) : (
          llmOptions.map((option) => (
            <DropdownMenuItem key={option} onClick={() => handleLlmChange(option)}>
              {option}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LlmSelector;
