
import React from 'react';
import { X } from 'lucide-react';
import { FilterOption } from '../../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface ActiveFiltersProps {
  filters: FilterOption[];
  onRemoveFilter: (index: number) => void;
  onClearFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ 
  filters, 
  onRemoveFilter, 
  onClearFilters
}) => {
  const { t } = useLanguage();

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">
        {t('active_filters')}:
      </span>
      
      {filters.map((filter, index) => {
        let displayValue = typeof filter.value === 'boolean' 
          ? filter.value ? 'Yes' : 'No' 
          : filter.value;

        return (
          <Badge 
            key={index}
            variant="outline" 
            className="flex items-center gap-1 py-1 px-2"
          >
            <span className="text-xs">
              {filter.field}: {displayValue}
            </span>
            <button
              onClick={() => onRemoveFilter(index)}
              className="hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearFilters}
        className="text-xs h-7 px-2"
      >
        {t('clear_all')}
      </Button>
    </div>
  );
};

export default ActiveFilters;
