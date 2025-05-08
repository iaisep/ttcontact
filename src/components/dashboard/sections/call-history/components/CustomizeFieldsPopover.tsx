
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';
import { ColumnVisibility } from '../types';

interface CustomizeFieldsPopoverProps {
  columnVisibility: ColumnVisibility;
  onToggleColumn: (column: string) => void;
  onSaveSettings: () => void;
}

const CustomizeFieldsPopover: React.FC<CustomizeFieldsPopoverProps> = ({
  columnVisibility,
  onToggleColumn,
  onSaveSettings
}) => {
  const { t } = useLanguage();
  
  const columns = [
    { id: 'time', label: t('time') },
    { id: 'callDuration', label: t('call_duration') },
    { id: 'type', label: t('type') },
    { id: 'cost', label: t('cost') },
    { id: 'callId', label: t('call_id') },
    { id: 'disconnectionReason', label: t('disconnection_reason') },
    { id: 'callStatus', label: t('call_status') },
    { id: 'userSentiment', label: t('user_sentiment') },
    { id: 'from', label: t('from') },
    { id: 'to', label: t('to') },
    { id: 'callSuccessful', label: t('call_successful') },
    { id: 'endToEndLatency', label: t('end_to_end_latency') },
    { id: 'oportunidad', label: t('oportunidad') },
    { id: 'opportunidad', label: t('opportunidad') },
    { id: 'resumen_2da_llamada', label: t('resumen_2da_llamada') },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {t('customize_field')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-4">
          <div className="font-medium">{t('customize_columns')}</div>
          
          <div className="max-h-80 overflow-y-auto space-y-1 py-1">
            {columns.map(column => (
              <div 
                key={column.id} 
                className="flex items-center space-x-2 px-2 py-1"
              >
                <input
                  type="checkbox"
                  id={`column-${column.id}`}
                  checked={!!columnVisibility[column.id]}
                  onChange={() => onToggleColumn(column.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label 
                  htmlFor={`column-${column.id}`}
                  className="flex-1 text-sm cursor-pointer"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Reset to default (all visible)
                columns.forEach(column => {
                  if (!columnVisibility[column.id]) {
                    onToggleColumn(column.id);
                  }
                });
              }}
            >
              {t('cancel')}
            </Button>
            <Button size="sm" onClick={onSaveSettings}>
              {t('save')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomizeFieldsPopover;
