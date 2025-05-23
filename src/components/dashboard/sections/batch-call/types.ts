
export interface BatchCall {
  id: string;
  status: 'completed' | 'in-progress' | 'failed' | 'queued';
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  agent_id: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  agent_id: string;
  voice_id: string;
  agent_type: string;
  last_modification_timestamp: string | number;
  updated_at: string;
}
