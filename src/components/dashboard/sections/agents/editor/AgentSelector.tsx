
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentSelectorProps {
  agents: RetellAgent[];
  currentAgentId: string;
  onSelect: (agent: RetellAgent) => void;
  onClose: () => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  currentAgentId,
  onSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAgents = agents.filter(agent => {
    const name = agent.agent_name || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Seleccionar Agente</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar agente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {filteredAgents.length > 0 ? (
            <div className="space-y-2">
              {filteredAgents.map(agent => (
                <div
                  key={agent.agent_id}
                  className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                    agent.agent_id === currentAgentId ? 'bg-muted' : ''
                  }`}
                  onClick={() => onSelect(agent)}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-3">
                    {agent.voice_id && (
                      <span className="text-sm font-semibold">
                        {agent.voice_id.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {agent.agent_name || 'Unnamed Agent'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {agent.agent_id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No se encontraron agentes
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentSelector;
