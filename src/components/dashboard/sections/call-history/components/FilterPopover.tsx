
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';
import { FilterOption } from '../types';
import {
  AgentFilterPopover,
  FilterOptions,
  ActiveFilters,
  useFilterPopover
} from './filter';

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
  const {
    isAgentFilterOpen,
    handleAgentFilterOpen,
    handleAgentFilterClose,
    handleApplyAgentFilter,
    fetchAgents
  } = useFilterPopover();

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
            {/* Filter Options */}
            <FilterOptions
              onAddFilter={onAddFilter}
              onOpenAgentFilter={handleAgentFilterOpen}
            />
            
            {/* Active Filters */}
            {filters.length > 0 && (
              <ActiveFilters
                filters={filters}
                onRemoveFilter={onRemoveFilter}
                onClearFilters={onClearFilters}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Agent Filter Popover */}
      {isAgentFilterOpen && (
        <Popover open={isAgentFilterOpen} onOpenChange={handleAgentFilterClose}>
          <AgentFilterPopover
            isOpen={isAgentFilterOpen}
            onClose={handleAgentFilterClose}
            onApply={(agentIds) => handleApplyAgentFilter(agentIds, onAddFilter)}
            fetchAgents={fetchAgents}
          />
        </Popover>
      )}
    </>
  );
};

export default FilterPopover;
