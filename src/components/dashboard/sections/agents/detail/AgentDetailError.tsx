
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AgentDetailErrorProps {
  error: string | null;
}

const AgentDetailError: React.FC<AgentDetailErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="p-6">
      <div className="bg-card rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold">{t('agent_not_found')}</h2>
        <p className="mt-2 text-muted-foreground">{error || t('agent_not_found_description')}</p>
        <Button onClick={() => navigate('/agentes')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_agents')}
        </Button>
      </div>
    </div>
  );
};

export default AgentDetailError;
