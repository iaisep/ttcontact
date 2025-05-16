
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TranscriptSectionProps {
  transcript: string;
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcript }) => {
  const { t } = useLanguage();
  
  if (!transcript) {
    return null;
  }
  
  return (
    <div className="mt-6 p-3 bg-slate-50 rounded-md">
      <h3 className="font-medium mb-2">{t('transcript')}</h3>
      <div className="text-sm bg-white p-3 rounded border border-slate-200 min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-line">
        {transcript}
      </div>
    </div>
  );
};

export default TranscriptSection;
