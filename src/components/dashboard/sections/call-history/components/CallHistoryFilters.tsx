
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { FilterOption } from '../types';
import DateRangePicker from './DateRangePicker';
import FilterPopover from './FilterPopover';
import CustomizeFieldsPopover from './CustomizeFieldsPopover';
import { ColumnVisibility } from '../types';

interface CallHistoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOption[];
  addFilter: (filter: FilterOption) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  dateRange: { start: Date | null; end: Date | null };
  updateDateRange: (start: Date | null, end: Date | null) => void;
  columnVisibility: ColumnVisibility;
  toggleColumnVisibility: (column: string) => void;
  updateColumnVisibility: (settings: ColumnVisibility) => void;
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

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-60">
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onRangeChange={updateDateRange}
        />
      </div>
      
      <div className="flex gap-2">
        <FilterPopover
          onAddFilter={addFilter}
          filters={filters}
          onRemoveFilter={removeFilter}
          onClearFilters={clearFilters}
        />
        
        <CustomizeFieldsPopover
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumnVisibility}
          onSaveSettings={() => console.log('Saved column settings')}
        />
      </div>
      
      <div className="flex-grow">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search_calls')}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CallHistoryFilters;
