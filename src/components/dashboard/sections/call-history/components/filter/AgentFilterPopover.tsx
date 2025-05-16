
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PopoverContent } from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';
import { Agent } from '../../../agents/types';

interface AgentFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (agentIds: string[]) => void;
  fetchAgents: () => Promise<Agent[]>;
}

const AgentFilterPopover: React.FC<AgentFilterPopoverProps> = ({
  isOpen,
  onClose,
  onApply,
  fetchAgents
}) => {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Fetch agents when opened
  useEffect(() => {
    if (isOpen) {
      loadAgents();
    }
  }, [isOpen]);

  const loadAgents = async () => {
    try {
      const agentList = await fetchAgents();
      setAgents(agentList || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle agent selection
  const handleAgentSelect = (agentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAgents([...selectedAgents, agentId]);
    } else {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    }
  };

  // Apply agent filter
  const handleApply = () => {
    onApply(selectedAgents);
    setSelectedAgents([]);
  };

  return (
    <PopoverContent className="w-80">
      <div className="space-y-4">
        <div className="font-medium">{t('filter by agent')}</div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_agent')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id} 
              className="flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded"
            >
              <input
                type="checkbox"
                id={`agent-${agent.id}`}
                checked={selectedAgents.includes(agent.id)}
                onChange={(e) => handleAgentSelect(agent.id, e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label 
                htmlFor={`agent-${agent.id}`}
                className="flex-1 text-sm cursor-pointer"
              >
                {agent.name}
                <div className="text-xs text-muted-foreground">
                  {agent.id}
                </div>
              </label>
            </div>
          ))}
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-2 text-sm text-muted-foreground">
              {t('no_agents_found')}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
          <Button onClick={handleApply}>
            {t('save')}
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
};

export default AgentFilterPopover;
