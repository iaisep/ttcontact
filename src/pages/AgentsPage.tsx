
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AgentsSection from '@/components/dashboard/sections/AgentsSection';

const AgentsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('agents')}</h1>
      <AgentsSection />
    </div>
  );
};

export default AgentsPage;
