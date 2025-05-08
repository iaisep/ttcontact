
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/context/LanguageContext';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onRangeChange,
}) => {
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectionState, setSelectionState] = useState<'start' | 'end'>('start');

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectionState === 'start') {
      onRangeChange(date, null);
      setSelectionState('end');
    } else {
      // Ensure end date is after start date
      if (startDate && date < startDate) {
        onRangeChange(date, startDate);
      } else {
        onRangeChange(startDate, date);
      }
      setIsCalendarOpen(false);
      setSelectionState('start');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsCalendarOpen(open);
    if (!open) {
      setSelectionState('start');
    }
  };

  const handleClear = () => {
    onRangeChange(null, null);
    setSelectionState('start');
  };

  const displayText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`;
    }
    if (startDate) {
      return `${format(startDate, 'MMM dd, yyyy')} - ${t('select_end_date')}`;
    }
    return t('date_range');
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
          onClick={() => setIsCalendarOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">
              {selectionState === 'start' ? t('select_start_date') : t('select_end_date')}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              {t('clear')}
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectionState === 'start' ? startDate || undefined : endDate || undefined}
          onSelect={handleSelect}
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
