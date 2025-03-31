
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RetellAgent, RetellVoice, RetellFolder, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';
import { debounce } from 'lodash';
import { toast } from 'sonner';

interface AgentSettingsFormProps {
  agent: RetellAgent;
  voices: RetellVoice[];
  folders: RetellFolder[];
  llms: RetellLLM[];
  onUpdate: (updates: Partial<RetellAgent>) => Promise<boolean>;
}

export const AgentSettingsForm: React.FC<AgentSettingsFormProps> = ({
  agent,
  voices,
  folders,
  llms,
  onUpdate
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState(agent.agent_name || agent.name || '');
  const [description, setDescription] = useState(agent.description || '');
  const [voiceId, setVoiceId] = useState(agent.voice_id || '');
  const [folder, setFolder] = useState(agent.folder || '');
  const [prompt, setPrompt] = useState(agent.prompt || '');
  const [welcomeMessage, setWelcomeMessage] = useState(agent.welcome_message || '');
  const [saving, setSaving] = useState(false);
  
  // Create debounced update functions for each field
  const debouncedUpdateName = debounce(async (value: string) => {
    setSaving(true);
    try {
      await onUpdate({ agent_name: value });
    } finally {
      setSaving(false);
    }
  }, 1000);
  
  const debouncedUpdateDescription = debounce(async (value: string) => {
    setSaving(true);
    try {
      await onUpdate({ description: value });
    } finally {
      setSaving(false);
    }
  }, 1000);
  
  const debouncedUpdatePrompt = debounce(async (value: string) => {
    setSaving(true);
    try {
      await onUpdate({ prompt: value });
    } finally {
      setSaving(false);
    }
  }, 1000);
  
  const debouncedUpdateWelcomeMessage = debounce(async (value: string) => {
    setSaving(true);
    try {
      await onUpdate({ welcome_message: value });
    } finally {
      setSaving(false);
    }
  }, 1000);
  
  // Handle direct updates (no debounce for selects)
  const handleVoiceChange = async (value: string) => {
    setSaving(true);
    setVoiceId(value);
    try {
      const success = await onUpdate({ voice_id: value });
      if (success) {
        toast.success(t('voice_updated'));
      }
    } catch (error) {
      console.error('Error updating voice:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleFolderChange = async (value: string) => {
    setSaving(true);
    setFolder(value);
    try {
      const success = await onUpdate({ folder: value });
      if (success) {
        toast.success(t('folder_updated'));
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle input changes with debounce
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
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    debouncedUpdatePrompt(value);
  };
  
  const handleWelcomeMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWelcomeMessage(value);
    debouncedUpdateWelcomeMessage(value);
  };
  
  // Reset form when agent changes
  useEffect(() => {
    setName(agent.agent_name || agent.name || '');
    setDescription(agent.description || '');
    setVoiceId(agent.voice_id || '');
    setFolder(agent.folder || '');
    setPrompt(agent.prompt || '');
    setWelcomeMessage(agent.welcome_message || '');
  }, [agent]);
  
  return (
    <div className="p-6 space-y-8">
      {/* Status indicator for saving */}
      {saving && (
        <div className="text-sm text-blue-500 animate-pulse fixed bottom-4 right-4 bg-white p-2 rounded-md shadow-md z-50">
          {t('saving')}...
        </div>
      )}
    
      {/* Basic information section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('basic_information')}</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t('name')}</Label>
            <Input 
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder={t('agent_name_placeholder')}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={t('agent_description_placeholder')}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="voice">{t('voice')}</Label>
            <select
              id="voice"
              value={voiceId}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              {voices && voices.length > 0 ? (
                voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="eleven_labs_emily">Eleven Labs - Emily</option>
                  <option value="eleven_labs_josh">Eleven Labs - Josh</option>
                  <option value="eleven_labs_rachel">Eleven Labs - Rachel</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <Label htmlFor="folder">{t('folder')}</Label>
            <select
              id="folder"
              value={folder}
              onChange={(e) => handleFolderChange(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">{t('no_folder')}</option>
              {folders && folders.length > 0 && folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Conversation settings section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('conversation_settings')}</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">{t('agent_prompt')}</Label>
            <Textarea 
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              placeholder={t('agent_prompt_placeholder')}
              className="mt-1"
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('agent_prompt_description')}
            </p>
          </div>
          
          <div>
            <Label htmlFor="welcome_message">{t('welcome_message')}</Label>
            <Textarea 
              id="welcome_message"
              value={welcomeMessage}
              onChange={handleWelcomeMessageChange}
              placeholder={t('welcome_message_placeholder')}
              className="mt-1"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('welcome_message_description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
