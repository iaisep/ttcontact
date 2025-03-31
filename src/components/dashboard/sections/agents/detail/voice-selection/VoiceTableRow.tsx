
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Voice } from './types';

interface VoiceTableRowProps {
  voice: Voice;
  onSelectVoice: (voice: Voice) => void;
}

const VoiceTableRow: React.FC<VoiceTableRowProps> = ({
  voice,
  onSelectVoice
}) => {
  return (
    <tr 
      onClick={() => onSelectVoice(voice)}
      className="hover:bg-gray-50 cursor-pointer border-b"
    >
      <td className="p-2 text-center">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Play className="h-4 w-4" />
        </Button>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            {voice.avatar_url ? (
              <img src={voice.avatar_url} alt={voice.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs">{voice.name.substring(0, 2)}</span>
            )}
          </div>
          <span>{voice.name}</span>
        </div>
      </td>
      <td className="p-2">
        <div className="flex flex-wrap gap-1">
          {voice.traits.map((trait, i) => (
            <span key={i} className="text-xs">
              {trait}{i < voice.traits.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </td>
      <td className="p-2 font-mono text-xs text-gray-500">
        {voice.voice_id}
      </td>
    </tr>
  );
};

export default VoiceTableRow;
