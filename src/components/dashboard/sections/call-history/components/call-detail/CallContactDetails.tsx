
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CallContactDetailsProps {
  from: string;
  to: string;
  status: string;
}

const CallContactDetails: React.FC<CallContactDetailsProps> = ({
  from,
  to,
  status
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{t('contact_details')}</h3>
      <dl className="space-y-1">
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('from')}:</dt>
          <dd className="text-sm">{from}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('to')}:</dt>
          <dd className="text-sm">{to}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-muted-foreground">{t('status')}:</dt>
          <dd className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs ${
              status === 'ended' 
                ? 'bg-green-100 text-green-800' 
                : status === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {status}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default CallContactDetails;
