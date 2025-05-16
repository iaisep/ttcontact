
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CallMetricsProps {
  latency: string | undefined;
  sentiment: string | undefined;
  completionRate: string | undefined;
}

const CallMetrics: React.FC<CallMetricsProps> = ({
  latency,
  sentiment,
  completionRate
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">{t('call_metrics')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('latency')}</p>
          <p className="text-lg font-semibold">{latency || '150ms'}</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('user_sentiment')}</p>
          <p className="text-lg font-semibold">{sentiment || 'Unknown'}</p>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('completion_rate')}</p>
          <p className="text-lg font-semibold">{completionRate || '98%'}</p>
        </div>
      </div>
    </div>
  );
};

export default CallMetrics;
