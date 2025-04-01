
import React from 'react';
import { Voice } from './types';
import { Button } from '@/components/ui/button';
import { Check, Play } from 'lucide-react';

interface VoiceTableProps {
  voices: Voice[];
  onSelectVoice: (voice: Voice) => void;
  selectedVoiceId?: string;
}

const VoiceTable: React.FC<VoiceTableProps> = ({
  voices,
  onSelectVoice,
  selectedVoiceId
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-white border-b">
            <tr>
              <th className="w-10 p-2"></th>
              <th className="text-left p-2 font-medium text-sm text-gray-600">Voice</th>
              <th className="text-left p-2 font-medium text-sm text-gray-600">Trait</th>
              <th className="text-left p-2 font-medium text-sm text-gray-600">Voice ID</th>
              <th className="w-24 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {voices.map((voice) => (
              <tr 
                key={voice.id} 
                className={`border-b hover:bg-gray-50 ${selectedVoiceId === voice.voice_id ? 'bg-blue-50' : ''}`}
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
                    variant={selectedVoiceId === voice.voice_id ? "default" : "outline"}
                    size="sm"
                    className={`${selectedVoiceId === voice.voice_id ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                    onClick={() => onSelectVoice(voice)}
                  >
                    {selectedVoiceId === voice.voice_id ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Selected
                      </span>
                    ) : 'Use Voice'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoiceTable;
