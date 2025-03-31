
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Agent } from './types';

interface AgentFormProps {
  initialAgent: Agent | null;
  onSubmit: (data: Agent) => void;
  onCancel: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ initialAgent, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialAgent?.name || '',
      description: initialAgent?.description || '',
      voice_id: initialAgent?.voice_id || 'eleven_labs_emily',
      folder: initialAgent?.folder || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Agent name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe what this agent does"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="voice_id">Voice ID</Label>
          <select
            id="voice_id"
            {...register('voice_id', { required: 'Voice ID is required' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="eleven_labs_emily">Eleven Labs - Emily</option>
            <option value="eleven_labs_josh">Eleven Labs - Josh</option>
            <option value="eleven_labs_rachel">Eleven Labs - Rachel</option>
            <option value="eleven_labs_sam">Eleven Labs - Sam</option>
            <option value="deepgram_nova">Deepgram - Nova</option>
            <option value="deepgram_aura">Deepgram - Aura</option>
          </select>
          {errors.voice_id && (
            <p className="text-sm text-destructive">{errors.voice_id.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="folder">Folder (Optional)</Label>
          <Input
            id="folder"
            {...register('folder')}
            placeholder="Optional folder to organize agents"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button type="submit">{initialAgent ? 'Update Agent' : 'Create Agent'}</Button>
      </DialogFooter>
    </form>
  );
};

export default AgentForm;
