
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';

interface AgentSelectorProps {
  currentAgent: RetellAgent;
  allAgents: RetellAgent[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (agentId: string) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  currentAgent,
  allAgents,
  isOpen,
  onOpen,
  onClose,
  onSelect
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter agents based on search query
  const filteredAgents = React.useMemo(() => {
    if (!searchQuery.trim()) return allAgents;
    
    const query = searchQuery.toLowerCase();
    return allAgents.filter(agent => 
      (agent.agent_name || agent.name || '').toLowerCase().includes(query)
    );
  }, [allAgents, searchQuery]);

  return (
    <>
      {/* Trigger button */}
      <Button 
        variant="outline" 
        onClick={onOpen}
        className="flex items-center space-x-2 p-2 rounded-md bg-white hover:bg-gray-50"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
          {(currentAgent.agent_name || currentAgent.name || 'A').charAt(0)}
        </div>
        <span className="font-medium">{currentAgent.agent_name || currentAgent.name}</span>
      </Button>
      
      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl">
          <DialogTitle className="text-xl font-semibold">{t('select_agent')}</DialogTitle>
          <DialogDescription>
            {t('select_agent_description')}
          </DialogDescription>
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('search_agents')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-3" 
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Agents list */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.agent_id || agent.id}
                  onClick={() => onSelect(agent.agent_id || agent.id)}
                  className={`flex items-center p-3 rounded-md text-left hover:bg-gray-50 transition-colors ${
                    (agent.agent_id || agent.id) === (currentAgent.agent_id || currentAgent.id) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold mr-3">
                    {(agent.agent_name || agent.name || 'A').charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{agent.agent_name || agent.name}</div>
                    <div className="text-sm text-gray-500">
                      {agent.description?.substring(0, 60) || t('no_description')}
                      {agent.description && agent.description.length > 60 ? '...' : ''}
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredAgents.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  {t('no_agents_found')}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
