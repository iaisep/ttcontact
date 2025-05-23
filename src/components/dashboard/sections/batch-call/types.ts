
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

/**
 * Interface representing a phone number with its associated data
 */
export interface PhoneNumberData {
  id: string;
  phone_number: string;
  friendly_name?: string;
  outbound_agent_id?: string;
  outbound_agent_name?: string;
  status?: string;
  created_at?: string;
}
