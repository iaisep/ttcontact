
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface AgentDetailHeaderProps {
  agent: RetellAgent;
  voice?: RetellVoice | null;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentDetailHeader: React.FC<AgentDetailHeaderProps> = ({ 
  agent, 
  voice, 
  updateAgentField 
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState(agent.agent_name || agent.name || '');
  const [description, setDescription] = useState(agent.description || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Create debounced update functions
  const debouncedUpdateName = debounce((value) => updateAgentField('agent_name', value), 1000);
  const debouncedUpdateDescription = debounce((value) => updateAgentField('description', value), 1000);

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

  const handlePlayVoice = () => {
    if (!voice?.preview_audio_url) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(voice.preview_audio_url);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }
    
    if (isPlayingAudio) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="bg-card py-6 px-4 shadow border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Agent Avatar (Voice Avatar) */}
          {voice?.avatar_url && (
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={voice.avatar_url} 
                  alt={voice.name || 'Agent'} 
                  className="w-24 h-24 rounded-full object-cover"
                />
                {voice.preview_audio_url && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-100"
                    onClick={handlePlayVoice}
                  >
                    <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'text-primary animate-pulse' : ''}`} />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Agent Information */}
          <div className="flex-grow space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('agent_name')}</label>
              <Input 
                value={name} 
                onChange={handleNameChange}
                placeholder={t('agent_name_placeholder')}
                className="w-full md:w-2/3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('description')}</label>
              <Textarea 
                value={description} 
                onChange={handleDescriptionChange}
                placeholder={t('agent_description_placeholder')}
                className="w-full md:w-2/3"
                rows={2}
              />
            </div>
            
            {/* Voice Information */}
            {voice && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">{t('voice')}:</span>
                <span>{voice.name || voice.voice_name}</span>
                {voice.accent && <span className="ml-2 text-gray-400">({voice.accent})</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailHeader;
