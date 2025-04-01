
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Check } from 'lucide-react';
import { Voice } from './types';

interface VoiceTableRowProps {
  voice: Voice;
  onSelectVoice: (voice: Voice) => void;
  isSelected?: boolean;
}

const VoiceTableRow: React.FC<VoiceTableRowProps> = ({
  voice,
  onSelectVoice,
  isSelected = false
}) => {
  return (
    <tr 
      className={`hover:bg-gray-50 cursor-pointer border-b ${isSelected ? 'bg-blue-50' : ''}`}
    >
      <td className="p-2 text-center">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Play className="h-4 w-4" />
        </Button>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600">
            {voice.avatar_url ? (
              <img src={voice.avatar_url} alt={voice.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-medium">{voice.name.substring(0, 2)}</span>
            )}
          </div>
          <div className="font-medium text-sm">{voice.name}</div>
        </div>
      </td>
      <td className="p-2">
        <div className="flex flex-wrap gap-1">
          {voice.traits.map((trait, i) => (
            <span key={i} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {trait}
            </span>
          ))}
        </div>
      </td>
      <td className="p-2 font-mono text-xs text-gray-500">
        {voice.voice_id}
      </td>
      <td className="p-2 text-right">
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={`${isSelected ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
          onClick={() => onSelectVoice(voice)}
        >
          {isSelected ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Selected
            </span>
          ) : 'Use Voice'}
        </Button>
      </td>
    </tr>
  );
};

export default VoiceTableRow;
