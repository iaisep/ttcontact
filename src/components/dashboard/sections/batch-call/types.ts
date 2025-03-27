
export interface BatchCall {
  id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  agent_id: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
}
