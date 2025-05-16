
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CallBasicInfoProps {
  timestamp: string;
  agentName: string | undefined;
  type: string;
  duration: string;
}

const CallBasicInfo: React.FC<CallBasicInfoProps> = ({
  timestamp,
  agentName,
  type,
  duration
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{t('basic_info')}</h3>
      <dl className="space-y-1">
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('timestamp')}:</dt>
          <dd className="text-sm">{timestamp}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('agent')}:</dt>
          <dd className="text-sm">{agentName || 'N/A'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('type')}:</dt>
          <dd className="text-sm">{type}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('duration')}:</dt>
          <dd className="text-sm">{duration}</dd>
        </div>
      </dl>
    </div>
  );
};

export default CallBasicInfo;
