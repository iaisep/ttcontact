
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';

interface AgentHeaderInfoProps {
  agent: RetellAgent;
  agentName: string;
  agentDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const AgentHeaderInfo: React.FC<AgentHeaderInfoProps> = ({
  agent,
  agentName,
  agentDescription,
  onNameChange,
  onDescriptionChange
}) => {
  const { t } = useLanguage();
  
  // Get avatar URL from the appropriate property
  const avatarUrl = agent.avatar_url || (agent.voice && agent.voice.avatar_url);

  return (
    <div className="px-6 pb-4 border-b">
      <div className="flex gap-4 items-start">
        {avatarUrl && (
          <div className="flex-shrink-0">
            <img 
              src={avatarUrl} 
              alt={agent.agent_name || "Agent"} 
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-grow space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t('agent_name')}</label>
            <Input 
              value={agentName} 
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('agent_name_placeholder')}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('description')}</label>
            <Textarea 
              value={agentDescription} 
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={t('agent_description_placeholder')}
              className="w-full"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHeaderInfo;
