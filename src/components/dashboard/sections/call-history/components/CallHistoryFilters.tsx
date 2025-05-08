
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterOption } from '../types';
import { AgentFilterPopover } from './filter/AgentFilterPopover';
import FilterOptions from './filter/FilterOptions'; 
import ActiveFilters from './filter/ActiveFilters';
import { ColumnVisibilitySelector } from './ColumnVisibilitySelector';

interface CallHistoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOption[];
  addFilter: (filter: FilterOption) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  updateDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (columnId: string) => void;
  updateColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
}

const CallHistoryFilters: React.FC<CallHistoryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  addFilter,
  removeFilter,
  clearFilters,
  dateRange,
  updateDateRange,
  columnVisibility,
  toggleColumnVisibility,
  updateColumnVisibility
}) => {
  const { t } = useLanguage();
  const [isAgentFilterOpen, setIsAgentFilterOpen] = useState(false);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  
  // Mock function to fetch agents - in a real app this would call an API
  const fetchAgents = async () => {
    // This would be replaced with an actual API call
    return [
      { id: 'agent-1', name: 'Customer Support Agent' },
      { id: 'agent-2', name: 'Sales Agent' },
      { id: 'agent-3', name: 'Technical Support Agent' }
    ];
  };

  // Function to add agent filters
  const handleAgentFilterApply = (agentIds: string[]) => {
    agentIds.forEach(agentId => {
      addFilter({ field: 'agentId', value: agentId, operator: 'equals' });
    });
    setIsAgentFilterOpen(false);
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      {/* Search bar */}
      <div className="flex items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('search_calls')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DateRangePicker
          value={dateRange}
          onChange={updateDateRange}
          className="ml-2"
        />
      </div>
      
      {/* Filters section */}
      <div className="flex flex-wrap gap-2">
        {/* Filter by agent button */}
        <Popover open={isAgentFilterOpen} onOpenChange={setIsAgentFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">{t('filter_by_agent')}</Button>
          </PopoverTrigger>
          <AgentFilterPopover
            isOpen={isAgentFilterOpen}
            onClose={() => setIsAgentFilterOpen(false)}
            onApply={handleAgentFilterApply}
            fetchAgents={fetchAgents}
          />
        </Popover>
        
        {/* Add filter button */}
        <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">{t('add_filter')}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <FilterOptions
              onAddFilter={(filter) => {
                addFilter(filter);
                setIsFilterPopoverOpen(false);
              }}
              onOpenAgentFilter={() => {
                setIsFilterPopoverOpen(false);
                setIsAgentFilterOpen(true);
              }}
            />
          </PopoverContent>
        </Popover>
        
        {/* Column visibility button */}
        <Popover open={isColumnSelectorOpen} onOpenChange={setIsColumnSelectorOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">{t('columns')}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ColumnVisibilitySelector
              columnVisibility={columnVisibility}
              toggleColumnVisibility={toggleColumnVisibility}
              updateColumnVisibility={updateColumnVisibility}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Display active filters */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default CallHistoryFilters;
