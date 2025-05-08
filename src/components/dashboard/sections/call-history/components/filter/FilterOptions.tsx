
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { FilterOption, CallHistoryItem } from '../../types';

interface FilterOptionsProps {
  onAddFilter: (filter: FilterOption) => void;
  onOpenAgentFilter: () => void;
}

// Define a type that maps filter IDs to CallHistoryItem keys
type FilterOptionMapping = {
  id: string;
  field: keyof CallHistoryItem;
  label: string;
};

const FilterOptions: React.FC<FilterOptionsProps> = ({ 
  onAddFilter, 
  onOpenAgentFilter 
}) => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('agent');
  const [filterValue, setFilterValue] = useState<string>('');

  // Filter options with explicit field mappings
  const filterOptions: FilterOptionMapping[] = [
    { id: 'agent', field: 'agentId', label: t('agent') },
    { id: 'callId', field: 'callId', label: t('call_id') },
    { id: 'batchCallId', field: 'batchCallId', label: t('batch_call_id') },
    { id: 'type', field: 'type', label: t('type') },
    { id: 'callDuration', field: 'duration', label: t('call_duration') },
    { id: 'from', field: 'from', label: t('from') },
    { id: 'to', field: 'to', label: t('to') },
    { id: 'userSentiment', field: 'userSentiment', label: t('user_sentiment') },
    { id: 'disconnectionReason', field: 'disconnectionReason', label: t('disconnection_reason') },
    { id: 'callSuccessful', field: 'callSuccessful', label: t('call_successful') },
    { id: 'callStatus', field: 'status', label: t('call_status') },
    { id: 'endToEndLatency', field: 'endToEndLatency', label: t('end_to_end_latency') }
  ];

  // Handle regular filter add
  const handleAddFilter = () => {
    if (filterValue) {
      // Find the corresponding field mapping for the selected filter
      const filterOption = filterOptions.find(option => option.id === selectedFilter);
      
      if (filterOption) {
        onAddFilter({
          field: filterOption.field,
          value: filterValue,
          operator: 'contains'
        });
        setFilterValue('');
      }
    }
  };

  return (
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
                onClick={onOpenAgentFilter}
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
    </div>
  );
};

export default FilterOptions;
