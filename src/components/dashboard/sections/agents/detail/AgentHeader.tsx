import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { debounce } from 'lodash';

interface AgentHeaderProps {
  agent: RetellAgent;
  voices: RetellVoice[];
  onUpdate: (fieldName: string, value: any) => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ agent, voices, onUpdate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(agent.agent_name || '');
  const [description, setDescription] = useState(agent.description || '');
  const [voice, setVoice] = useState(agent.voice_id || '');

  // Create debounced update functions
  const debouncedUpdateName = debounce((value) => onUpdate('agent_name', value), 1000);
  const debouncedUpdateDescription = debounce((value) => onUpdate('description', value), 1000);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    debouncedUpdateName(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    debouncedUpdateDescription(value);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setVoice(value);
    onUpdate('voice_id', value);
  };

  // Find current voice for display
  const currentVoice = voices.find(v => v.id === voice);

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {currentVoice?.avatar_url && (
          <div className="flex-shrink-0">
            <img 
              src={currentVoice.avatar_url} 
              alt={currentVoice.name} 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-grow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('agent_name')}</label>
            <Input 
              value={name} 
              onChange={handleNameChange}
              placeholder={t('agent_name_placeholder')}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('description')}</label>
            <Textarea 
              value={description} 
              onChange={handleDescriptionChange}
              placeholder={t('agent_description_placeholder')}
              className="w-full"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('voice')}</label>
            <select 
              value={voice} 
              onChange={handleVoiceChange}
              className="w-full p-2 border rounded-md"
            >
              {voices.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHeader;
