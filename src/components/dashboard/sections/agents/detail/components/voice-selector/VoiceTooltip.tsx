
import React from 'react';
import { Settings } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface VoiceTooltipProps {
  onSettingsClick: (e: React.MouseEvent) => void;
}

const VoiceTooltip: React.FC<VoiceTooltipProps> = ({ onSettingsClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 ml-1 sm:ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
            onClick={onSettingsClick}
          >
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Voice Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceTooltip;
