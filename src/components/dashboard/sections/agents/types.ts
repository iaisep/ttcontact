
export interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type?: string; 
  voice_id?: string;
  voice?: {
    name: string;
    avatar_url?: string;
  };
  phone?: string;
  last_modification_timestamp?: number;
  folder?: string;
}
