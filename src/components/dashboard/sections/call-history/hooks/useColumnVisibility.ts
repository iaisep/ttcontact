
import { useState } from 'react';
import { ColumnVisibility } from '../types';

export const useColumnVisibility = () => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    time: true,
    callDuration: true,
    type: true,
    cost: true,
    callId: true,
    disconnectionReason: true,
    callStatus: true,
    userSentiment: true,
    from: true,
    to: true,
    callSuccessful: true,
    endToEndLatency: true,
    oportunidad: true,
    opportunidad: true,
    resumen_2da_llamada: true
  });

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Update multiple column visibility settings
  const updateColumnVisibility = (settings: ColumnVisibility) => {
    setColumnVisibility(settings);
  };

  return {
    columnVisibility,
    toggleColumnVisibility,
    updateColumnVisibility
  };
};
