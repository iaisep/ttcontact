
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { FilterOption } from '../types';
import { Agent } from '../../agents/types';
import { useApiContext } from '@/context/ApiContext';

interface FilterPopoverProps {
  onAddFilter: (filter: FilterOption) => void;
  filters: FilterOption[];
  onRemoveFilter: (index: number) => void;
  onClearFilters: () => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  onAddFilter,
  filters,
  onRemoveFilter,
  onClearFilters
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [selectedFilter, setSelectedFilter] = useState<string>('agent');
  const [filterValue, setFilterValue] = useState<string>('');
  const [isAgentFilterOpen, setIsAgentFilterOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchAgentQuery, setSearchAgentQuery] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Filter options
  const filterOptions = [
    { id: 'agent', label: t('agent') },
    { id: 'callId', label: t('call_id') },
    { id: 'batchCallId', label: t('batch_call_id') },
    { id: 'type', label: t('type') },
    { id: 'callDuration', label: t('call_duration') },
    { id: 'from', label: t('from') },
    { id: 'to', label: t('to') },
    { id: 'userSentiment', label: t('user_sentiment') },
    { id: 'disconnectionReason', label: t('disconnection_reason') },
    { id: 'callSuccessful', label: t('call_successful') },
    { id: 'callStatus', label: t('call_status') },
    { id: 'endToEndLatency', label: t('end_to_end_latency') }
  ];

  // Fetch agents for the agent filter
  const fetchAgents = async () => {
    try {
      const response = await fetchWithAuth('/list-agents');
      setAgents(response || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  // Handle agent filter open
  const handleAgentFilterOpen = () => {
    setIsAgentFilterOpen(true);
    fetchAgents();
  };

  // Handle agent selection
  const handleAgentSelect = (agentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAgents([...selectedAgents, agentId]);
    } else {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    }
  };

  // Apply agent filter
  const handleApplyAgentFilter = () => {
    if (selectedAgents.length > 0) {
      selectedAgents.forEach(agentId => {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          onAddFilter({
            field: 'agentId',
            value: agentId,
            operator: 'equals'
          });
        }
      });
    }
    setIsAgentFilterOpen(false);
    setSelectedAgents([]);
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchAgentQuery.toLowerCase())
  );

  // Handle regular filter add
  const handleAddFilter = () => {
    if (filterValue) {
      onAddFilter({
        field: selectedFilter as keyof FilterOption['field'],
        value: filterValue,
        operator: 'contains'
      });
      setFilterValue('');
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('filter')}
            {filters.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary text-white w-5 h-5 text-xs">
                {filters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="font-medium">{t('add_filter')}</div>
            
            <div className="grid gap-2">
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    {filterOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-3">
                  {selectedFilter === 'agent' ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleAgentFilterOpen}
                    >
                      {t('select_agents')}
                    </Button>
                  ) : (
                    <Input
                      placeholder={t('filter_value')}
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
              
              <Button onClick={handleAddFilter}>
                {t('add_filter')}
              </Button>
            </div>
            
            {filters.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium">{t('active_filters')}</div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter, index) => (
                    <div 
                      key={index} 
                      className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <span>{filterOptions.find(opt => opt.id === filter.field)?.label || filter.field}: {filter.value}</span>
                      <button 
                        onClick={() => onRemoveFilter(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClearFilters}
                    className="mt-2"
                  >
                    {t('clear_all')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Agent Filter Popover */}
      <Popover open={isAgentFilterOpen} onOpenChange={setIsAgentFilterOpen}>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="font-medium">{t('filter_by_agent')}</div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search_agent')}
                className="pl-8"
                value={searchAgentQuery}
                onChange={(e) => setSearchAgentQuery(e.target.value)}
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
                onClick={() => setIsAgentFilterOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button onClick={handleApplyAgentFilter}>
                {t('save')}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default FilterPopover;
