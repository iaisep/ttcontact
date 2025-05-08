
import { useState, useEffect } from 'react';
import { Agent, BatchCall } from '../../batch-call/types';

export const useBatchCallData = () => {
  const [batches, setBatches] = useState<BatchCall[]>([]);
  const [batchAgents, setBatchAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetchMockBatchData();
  }, []);

  const fetchMockBatchData = () => {
    setBatches([
      {
        id: '1',
        status: 'completed',
        total_calls: 50,
        completed_calls: 48,
        failed_calls: 2,
        agent_id: 'agent_1',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        status: 'in-progress',
        total_calls: 100,
        completed_calls: 45,
        failed_calls: 3,
        agent_id: 'agent_2',
        created_at: new Date().toISOString(),
      },
    ]);
    
    setBatchAgents([
      { id: 'agent_1', name: 'Sales Agent', agent_id: 'agent_1', voice_id: 'voice_1', agent_type: 'sales', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'agent_2', name: 'Support Agent', agent_id: 'agent_2', voice_id: 'voice_2', agent_type: 'support', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'agent_3', name: 'Appointment Scheduler', agent_id: 'agent_3', voice_id: 'voice_3', agent_type: 'scheduler', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]);
  };

  return {
    batches,
    batchAgents
  };
};
