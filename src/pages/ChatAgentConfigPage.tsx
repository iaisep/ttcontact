
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ChatAgentConfig from '@/components/dashboard/sections/ChatAgentsSection/ChatAgentConfig';
import { useChatAgentDetails } from '@/components/dashboard/sections/ChatAgentsSection/hooks/useChatAgentDetails';

const ChatAgentConfigPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agent, isLoading, error } = useChatAgentDetails(agentId);

  console.log('ChatAgentConfigPage - agentId:', agentId);
  console.log('ChatAgentConfigPage - agent:', agent);
  console.log('ChatAgentConfigPage - isLoading:', isLoading);
  console.log('ChatAgentConfigPage - error:', error);

  const handleBack = () => {
    // Navigate to dashboard and ensure Chat Agents section is active
    navigate('/dashboard', { 
      state: { activeSection: 'chat-agents' }, 
      replace: true 
    });
    
    // Also trigger a page refresh to ensure the section loads properly
    setTimeout(() => {
      window.location.hash = '#chat-agents';
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">
            {error || 'No se pudo cargar la información del agente.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-sm text-muted-foreground">Agent ID: {agent.id}</p>
        </div>
      </div>
      
      <ChatAgentConfig agent={agent} />
    </div>
  );
};

export default ChatAgentConfigPage;
