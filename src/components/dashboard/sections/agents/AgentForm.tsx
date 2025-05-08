
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Agent } from './types';
import { useLanguage } from '@/context/LanguageContext';
import { RetellVoice, RetellFolder, RetellLLM } from './types/retell-types';

interface AgentFormProps {
  initialAgent: Agent | null;
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
};

const AgentForm: React.FC<AgentFormProps> = ({ 
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
      name: initialAgent?.name || '',
      description: initialAgent?.description || '',
      voice_id: initialAgent?.voice_id || 'eleven_labs_emily',
      folder: initialAgent?.folder || '',
    }
  });

  const handleFormSubmit = (formData: FormValues) => {
    // Create a complete Agent object
    const agentData: Agent = {
      ...(initialAgent || { id: '', name: '', description: '' }),
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
          {initialAgent ? t('update_agent') : t('create_agent')}
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;
