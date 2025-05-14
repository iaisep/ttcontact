
import React from 'react';
import { Cog } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectorProps {
  analysisModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ analysisModel, onModelChange }) => {
  return (
    <Select value={analysisModel} onValueChange={onModelChange}>
      <SelectTrigger className="h-8 border-none hover:bg-gray-50 text-xs flex items-center gap-1 w-auto">
        <Cog className="h-4 w-4 text-gray-400" />
        <span>{analysisModel === 'gpt-4o' ? 'GPT-4o' : 'GPT-4o Mini'}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o-mini">
          <div className="flex items-center">
            <span>GPT-4o Mini</span>
            <span className="ml-2 text-xs text-gray-500">(Free)</span>
          </div>
        </SelectItem>
        <SelectItem value="gpt-4o">
          <div className="flex items-center">
            <span>GPT-4o</span>
            <span className="ml-2 text-xs text-gray-500">($0.017/session)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
