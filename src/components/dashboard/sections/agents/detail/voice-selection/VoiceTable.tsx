
import React from 'react';
import VoiceTableRow from './VoiceTableRow';
import { Voice } from './types';

interface VoiceTableProps {
  voices: Voice[];
  onSelectVoice: (voice: Voice) => void;
}

const VoiceTable: React.FC<VoiceTableProps> = ({
  voices,
  onSelectVoice
}) => {
  return (
    <div className="overflow-auto h-[400px] border rounded-md">
      <table className="w-full">
        <thead className="sticky top-0 bg-white border-b">
          <tr>
            <th className="w-12"></th>
            <th className="text-left p-2 font-medium">Voice</th>
            <th className="text-left p-2 font-medium">Trait</th>
            <th className="text-left p-2 font-medium">Voice ID</th>
          </tr>
        </thead>
        <tbody>
          {voices.map((voice) => (
            <VoiceTableRow 
              key={voice.id} 
              voice={voice} 
              onSelectVoice={onSelectVoice} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoiceTable;
