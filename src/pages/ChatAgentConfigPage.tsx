import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Save, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

interface ChatAgent {
  id: string;
  name: string;
  platform: string;
  status: string;
  description: string;
  lastActivity: string;
  messagesCount: number;
  avatar: string;
  prompt?: string;
  path_url_large?: string;
}

const ChatAgentConfigPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<ChatAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [pathUrl, setPathUrl] = useState('');

  useEffect(() => {
    fetchAgentDetails();
  }, [id]);

  const fetchAgentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://chatwoot.totalcontact.com.mx/api/v1/accounts/1/agent_bots', {
        method: 'GET',
        headers: {
          'api_access_token': 'YZEKfqAJsnEWoshpdRCq9yZn',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const agents = data.payload || data || [];
      const selectedAgent = agents.find((a: any) => a.id?.toString() === id);
      
      if (selectedAgent) {
        const transformedAgent: ChatAgent = {
          id: selectedAgent.id?.toString() || id || '',
          name: selectedAgent.name || selectedAgent.bot_name || 'Unknown Agent',
          platform: selectedAgent.platform || selectedAgent.channel_type || 'Unknown',
          status: selectedAgent.status || (selectedAgent.active ? 'active' : 'inactive'),
          description: selectedAgent.description || selectedAgent.bot_description || 'No description available',
          lastActivity: selectedAgent.updated_at || selectedAgent.last_activity || new Date().toISOString(),
          messagesCount: selectedAgent.messages_count || selectedAgent.conversation_count || 0,
          avatar: getPlatformIcon(selectedAgent.platform || selectedAgent.channel_type || 'Unknown'),
          prompt: selectedAgent.prompt || '',
          path_url_large: selectedAgent.outgoing_url || ''
        };
        
        setAgent(transformedAgent);
        setPathUrl(transformedAgent.path_url_large || '');
        
        // Fetch the current prompt from the webhook endpoint
        if (transformedAgent.path_url_large) {
          await fetchCurrentPrompt(transformedAgent.path_url_large);
        } else {
          setPrompt(transformedAgent.prompt || '');
        }
      }
    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast.error('Error al cargar los detalles del agente');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentPrompt = async (webhookUrl: string) => {
    setIsLoadingPrompt(true);
    try {
      const response = await fetch('https://flow.totalcontact.com.mx/webhook/get_propmt_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: webhookUrl
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.prompt_final) {
        setPrompt(data.prompt_final);
      }
    } catch (error) {
      console.error('Error fetching current prompt:', error);
      // Si falla, usar el prompt básico del agente
      setPrompt(agent?.prompt || '');
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'whatsapp':
        return '💬';
      case 'telegram':
        return '✈️';
      case 'sms':
        return '📱';
      case 'facebook messenger':
      case 'facebook':
        return '📘';
      case 'discord':
        return '🎮';
      case 'instagram':
        return '📷';
      case 'twitter':
        return '🐦';
      default:
        return '🤖';
    }
  };

  const handleSavePrompt = async () => {
    if (!agent) return;

    setIsSaving(true);
    try {
      const payload = {
        name: agent.name,
        prompt: prompt,
        path_url_large: pathUrl
      };

      const response = await fetch('https://flow.totalcontact.com.mx/webhook/prompts_updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Prompt actualizado exitosamente');
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Error al actualizar el prompt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard', { state: { activeSection: 'chat-agents' } });
  };

  const toggleExpandedView = () => {
    setIsExpandedView(!isExpandedView);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Agente no encontrado</h2>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Chat Agents
          </Button>
        </div>

        {/* Agent Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{agent.avatar}</span>
              <div>
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                <p className="text-sm text-gray-500">{agent.platform} • {agent.status}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Descripción:</span>
                <p className="text-gray-600">{agent.description}</p>
              </div>
              <div>
                <span className="font-medium">Mensajes:</span>
                <p className="text-gray-600">{agent.messagesCount}</p>
              </div>
              <div>
                <span className="font-medium">Última actividad:</span>
                <p className="text-gray-600">{new Date(agent.lastActivity).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompt Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configuración del Prompt</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleExpandedView}
                className="flex items-center gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Ampliar Vista
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prompt del Agente
              </label>
              {isLoadingPrompt ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Cargando prompt actual...</span>
                </div>
              ) : (
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ingresa el prompt para el agente..."
                  rows={8}
                  className="resize-none"
                />
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSavePrompt} 
                disabled={isSaving || isLoadingPrompt}
                className="min-w-32"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Prompt
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expanded View Modal */}
      <Dialog open={isExpandedView} onOpenChange={setIsExpandedView}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Prompt del Agente - {agent.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleExpandedView}
                className="flex items-center gap-2"
              >
                <Minimize2 className="h-4 w-4" />
                Cerrar Vista Ampliada
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-2">
                Prompt del Agente
              </label>
              {isLoadingPrompt ? (
                <div className="flex items-center justify-center flex-1">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Cargando prompt actual...</span>
                </div>
              ) : (
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ingresa el prompt para el agente..."
                  className="flex-1 resize-none min-h-[500px] font-mono text-sm"
                />
              )}
            </div>

            <div className="flex justify-end gap-2 flex-shrink-0">
              <Button variant="outline" onClick={toggleExpandedView}>
                Cerrar
              </Button>
              <Button 
                onClick={handleSavePrompt} 
                disabled={isSaving || isLoadingPrompt}
                className="min-w-32"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Prompt
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatAgentConfigPage;
