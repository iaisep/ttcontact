
import { useState, useEffect } from 'react';
import { useBatchCallData as useCoreBatchCallData } from '../../batch-call/hooks/useBatchCallData';

/**
 * This is a wrapper hook for the batch call data specifically for the analytics section
 * It re-exports the core useBatchCallData hook from the batch-call section
 */
export const useBatchCallData = () => {
  return useCoreBatchCallData();
};
