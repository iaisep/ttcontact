
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CallHistoryHeaderProps {
  onExport: () => void;
}

const CallHistoryHeader: React.FC<CallHistoryHeaderProps> = ({ onExport }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <h1 className="text-2xl font-bold">{t('call_history')}</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          {t('export')}
        </Button>
      </div>
    </div>
  );
};

export default CallHistoryHeader;
