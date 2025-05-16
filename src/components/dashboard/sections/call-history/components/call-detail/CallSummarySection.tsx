
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CallSummarySectionProps {
  summary: string;
}

const CallSummarySection: React.FC<CallSummarySectionProps> = ({ summary }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-6 p-3 bg-slate-50 rounded-md">
      <h3 className="font-medium mb-2">{t('call_summary')}</h3>
      <div className="text-sm bg-white p-3 rounded border border-slate-200 min-h-[100px]">
        {summary}
      </div>
    </div>
  );
};

export default CallSummarySection;
