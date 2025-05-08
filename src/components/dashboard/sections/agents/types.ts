
export interface Agent {
  id: string;
  name: string;
  description?: string;
  agent_type?: string; 
  voice_id?: string;
  voice_model?: string;
  voice?: {
    name: string;
    avatar_url?: string;
  };
  phone?: string;
  last_modification_timestamp?: number;
  folder?: string;
  
  // Additional fields from the API response
  voice_temperature?: number;
  voice_speed?: number;
  volume?: number;
  enable_backchannel?: boolean;
  backchannel_words?: string[];
  interruption_sensitivity?: number;
  ambient_sound?: string;
  responsiveness?: number;
  language?: string;
  webhook_url?: string;
  boosted_keywords?: string[];
  
  // For compatibility with RetellAgent
  agent_id?: string;
  agent_name?: string;
  knowledge_base_ids?: string[];
  llm_id?: string;
  response_engine?: { 
    type: string;
    llm_id?: string;
  };
}
