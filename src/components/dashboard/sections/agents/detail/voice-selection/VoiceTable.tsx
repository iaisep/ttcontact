
import React from 'react';
import VoiceTableRow from './VoiceTableRow';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceTableProps {
  voices: RetellVoice[];
  onSelectVoice: (voice: RetellVoice) => void;
  selectedVoiceId?: string;
}

const VoiceTable: React.FC<VoiceTableProps> = ({ voices, onSelectVoice, selectedVoiceId }) => {
  const { t } = useLanguage();
  
  return (
    <ScrollArea className="h-[400px] overflow-auto">
      {voices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('no_voices_found')}
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              <th className="text-left py-2 px-4 text-xs font-medium">{t('voice')}</th>
              <th className="text-left py-2 px-4 text-xs font-medium">{t('traits')}</th>
              <th className="text-center py-2 px-4 text-xs font-medium">{t('preview') || 'Preview'}</th>
              <th className="text-right py-2 px-4 text-xs font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {voices.map((voice) => (
              <VoiceTableRow
                key={voice.voice_id || voice.id}
                voice={voice}
                onSelect={() => onSelectVoice(voice)}
                isSelected={selectedVoiceId === voice.voice_id || selectedVoiceId === voice.id}
              />
            ))}
          </tbody>
        </table>
      )}
    </ScrollArea>
  );
};

export default VoiceTable;
