
import { useState, useEffect } from 'react';
import { Agent, BatchCall } from '../types';
import { fetchMockBatchCallData } from './useMockBatchCallData';

/**
 * Hook for managing batch call data
 * Fetches batch calls and related agent data
 */
export const useBatchCallData = () => {
  const [batches, setBatches] = useState<BatchCall[]>([]);
  const [batchAgents, setBatchAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBatchData();
  }, []);

  const fetchBatchData = async () => {
    setLoading(true);
    try {
      const { mockBatches, mockAgents } = fetchMockBatchCallData();
      setBatches(mockBatches);
      setBatchAgents(mockAgents);
    } catch (error) {
      console.error("Error fetching batch call data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    batches,
    batchAgents,
    loading,
    refreshData: fetchBatchData
  };
};
