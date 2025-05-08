
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { FilterOption, CallHistoryItem } from '../../types';

interface ActiveFiltersProps {
  filters: FilterOption[];
  onRemoveFilter: (index: number) => void;
  onClearFilters: () => void;
}

// Define a type that maps filter IDs to CallHistoryItem keys
type FilterOptionMapping = {
  field: keyof CallHistoryItem;
  label: string;
};

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearFilters
}) => {
  const { t } = useLanguage();

  if (filters.length === 0) {
    return null;
  }

  // Filter options with explicit field mappings
  const filterOptions: FilterOptionMapping[] = [
    { field: 'agentId', label: t('agent') },
    { field: 'callId', label: t('call_id') },
    { field: 'batchCallId', label: t('batch_call_id') },
    { field: 'type', label: t('type') },
    { field: 'duration', label: t('call_duration') },
    { field: 'from', label: t('from') },
    { field: 'to', label: t('to') },
    { field: 'userSentiment', label: t('user_sentiment') },
    { field: 'disconnectionReason', label: t('disconnection_reason') },
    { field: 'callSuccessful', label: t('call_successful') },
    { field: 'status', label: t('call_status') },
    { field: 'endToEndLatency', label: t('end_to_end_latency') }
  ];

  return (
    <div className="space-y-2">
      <div className="font-medium">{t('active_filters')}</div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => {
          // Find the display label for this field
          const filterOption = filterOptions.find(opt => opt.field === filter.field);
          const displayLabel = filterOption ? filterOption.label : String(filter.field);
          
          return (
            <div 
              key={index} 
              className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <span>{displayLabel}: {filter.value}</span>
              <button 
                onClick={() => onRemoveFilter(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          );
        })}
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
  );
};

export default ActiveFilters;
