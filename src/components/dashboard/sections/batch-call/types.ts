
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
  agent_id: string;
  agent_name?: string;
  agent_type?: string;
  voice_id: string;
  voice_model?: string;
  voice_temperature?: number;
  voice_speed?: number;
  response_engine?: {
    type: string;
    llm_id?: string;
  };
  last_modification_timestamp: number | string;
  updated_at?: string;
}
