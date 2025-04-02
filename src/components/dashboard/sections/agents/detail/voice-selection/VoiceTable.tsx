
import React from 'react';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import VoiceTableRow from './VoiceTableRow';
import { Button } from '@/components/ui/button';

interface VoiceTableProps {
  voices: RetellVoice[];
  onSelectVoice: (voice: RetellVoice) => void;
  selectedVoiceId?: string;
}

const VoiceTable: React.FC<VoiceTableProps> = ({
  voices,
  onSelectVoice,
  selectedVoiceId
}) => {
  return (
    <div className="border rounded-md mt-4">
      <div className="grid grid-cols-4 p-4 border-b bg-gray-50">
        <div className="font-medium text-gray-700">Voice</div>
        <div className="font-medium text-gray-700">Traits</div>
        <div className="font-medium text-gray-700">Voice ID</div>
        <div className="font-medium text-gray-700 text-right">Action</div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {voices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No voices found that match your filters
          </div>
        ) : (
          voices.map(voice => (
            <VoiceTableRow 
              key={voice.id} 
              voice={voice} 
              isSelected={selectedVoiceId === voice.id}
              onSelect={() => onSelectVoice(voice)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceTable;
