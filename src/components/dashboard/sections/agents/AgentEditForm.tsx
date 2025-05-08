
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Agent } from './types';
import { useLanguage } from '@/context/LanguageContext';

interface RetellVoice {
  id: string;
  name: string;
  [key: string]: any;
}

interface RetellFolder {
  id: string;
  name: string;
  [key: string]: any;
}

interface RetellLLM {
  id: string;
  name: string;
  [key: string]: any;
}

interface AgentEditFormProps {
  initialAgent: Agent;
  onSubmit: (data: Agent) => void;
  onCancel: () => void;
  voices?: RetellVoice[];
  folders?: RetellFolder[];
  llms?: RetellLLM[];
}

type FormValues = {
  name: string;
  description: string;
  voice_id: string;
  folder: string;
  agent_type: string;
};

const AgentEditForm: React.FC<AgentEditFormProps> = ({ 
  initialAgent, 
  onSubmit, 
  onCancel,
  voices = [],
  folders = [],
  llms = []
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: initialAgent.name || '',
      description: initialAgent.description || '',
      voice_id: initialAgent.voice_id || 'eleven_labs_emily',
      folder: initialAgent.folder || '',
      agent_type: initialAgent.agent_type || 'uisep-llm',
    }
  });

  const handleFormSubmit = (formData: FormValues) => {
    // Create a complete Agent object by updating the id and other fields
    const agentData: Agent = {
      ...initialAgent,
      ...formData
    };
    onSubmit(agentData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            id="name"
            {...register('name', { required: t('name_required') })}
            placeholder={t('agent_name_placeholder')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">{t('description')}</Label>
          <Textarea
            id="description"
            {...register('description', { required: t('description_required') })}
            placeholder={t('agent_description_placeholder')}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="agent_type">{t('agent_type')}</Label>
          <select
            id="agent_type"
            {...register('agent_type')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="uisep-llm">uisep-llm</option>
            <option value="retell-llm">retell-llm</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="voice_id">{t('voice_id')}</Label>
          <select
            id="voice_id"
            {...register('voice_id', { required: t('voice_id_required') })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            {voices && voices.length > 0 ? (
              voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))
            ) : (
              // Fallback options if no voices are provided
              <>
                <option value="eleven_labs_emily">Eleven Labs - Emily</option>
                <option value="eleven_labs_josh">Eleven Labs - Josh</option>
                <option value="eleven_labs_rachel">Eleven Labs - Rachel</option>
                <option value="eleven_labs_sam">Eleven Labs - Sam</option>
                <option value="deepgram_nova">Deepgram - Nova</option>
                <option value="deepgram_aura">Deepgram - Aura</option>
              </>
            )}
          </select>
          {errors.voice_id && (
            <p className="text-sm text-destructive">{errors.voice_id.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="folder">{t('folder')}</Label>
          <select
            id="folder"
            {...register('folder')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">{t('no_folder')}</option>
            {folders && folders.length > 0 && folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {t('update_agent')}
        </Button>
      </div>
    </form>
  );
};

export default AgentEditForm;
