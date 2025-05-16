export interface Agent {
  id: string;
  name: string;
  agent_id: string;
  voice_id: string;
  agent_type: string;
  last_modification_timestamp: string;
  updated_at: string;
}

export interface BatchCall {
  id: string;
  status: 'completed' | 'in-progress' | 'failed';
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  agent_id: string;
  created_at: string;
}

export interface PhoneNumberData {
  id: string;
  phone_number: string;
  phone_number_type: string;
  phone_number_pretty: string;
  nickname: string;
  friendly_name: string;
  outbound_agent_id: string;
  inbound_agent_id: string;
}
