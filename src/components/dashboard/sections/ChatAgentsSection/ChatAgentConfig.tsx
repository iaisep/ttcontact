import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Settings, FileText } from 'lucide-react';

interface ChatAgentConfigProps {
  agent: {
    id: string;
    name: string;
    description: string;
    outgoing_url: string;
    account_id: string;
  };
}

const ChatAgentConfig: React.FC<ChatAgentConfigProps> = ({ agent }) => {
  const [prompt, setPrompt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePromptUpdate = async () => {
    if (!prompt.trim()) {
      toast.error('El prompt no puede estar vacío');
      return;
    }

    setIsUpdating(true);
    
    try {
      const response = await fetch('https://flow.totalcontact.com.mx/webhook/prompts_updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: agent.name,
          prompt: prompt,
          path_url_large: agent.outgoing_url
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Prompt actualizado exitosamente');
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Error al actualizar el prompt');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Información del Agente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agentName">Nombre del Agente</Label>
              <Input
                id="agentName"
                value={agent.name}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="agentId">ID del Agente</Label>
              <Input
                id="agentId"
                value={agent.id}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={agent.description}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="webhookUrl">URL del Webhook</Label>
            <Input
              id="webhookUrl"
              value={agent.outgoing_url}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prompt Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuración del Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Prompt del Agente</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ingresa el prompt para el agente..."
              className="min-h-[300px] font-mono text-sm"
              rows={15}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {prompt.length} caracteres
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePromptUpdate}
              disabled={isUpdating || !prompt.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Guardando...' : 'Guardar Prompt'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatAgentConfig;
