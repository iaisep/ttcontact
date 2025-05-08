
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ColumnVisibilitySelectorProps {
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (columnId: string) => void;
  updateColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
}

export const ColumnVisibilitySelector: React.FC<ColumnVisibilitySelectorProps> = ({
  columnVisibility,
  toggleColumnVisibility,
  updateColumnVisibility
}) => {
  const { t } = useLanguage();
  
  const columns = [
    { id: 'timestamp', label: t('timestamp'), required: true },
    { id: 'agentName', label: t('agent') },
    { id: 'type', label: t('type') },
    { id: 'duration', label: t('duration') },
    { id: 'from', label: t('from') },
    { id: 'to', label: t('to') },
    { id: 'status', label: t('status') }
  ];

  const handleShowAll = () => {
    const allVisibleColumns = columns.reduce((acc, column) => {
      acc[column.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    updateColumnVisibility(allVisibleColumns);
  };

  const handleHideAll = () => {
    const minimalVisibleColumns = columns.reduce((acc, column) => {
      // Only required columns remain visible
      acc[column.id] = column.required ? true : false;
      return acc;
    }, {} as Record<string, boolean>);
    updateColumnVisibility(minimalVisibleColumns);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{t('column_visibility')}</span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleShowAll}>
            {t('show_all')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleHideAll}>
            {t('hide_all')}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {columns.map(column => (
          <div key={column.id} className="flex items-center space-x-2">
            <Checkbox
              id={`column-${column.id}`}
              checked={columnVisibility[column.id] !== false} // Default to true if undefined
              onCheckedChange={() => toggleColumnVisibility(column.id)}
              disabled={column.required} // Required columns cannot be toggled
            />
            <label
              htmlFor={`column-${column.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {column.label}
              {column.required && <span className="text-xs text-muted-foreground ml-1">({t('required')})</span>}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
