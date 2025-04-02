
export interface RetellAgent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  voice_id: string;
  folder: string;
  agent_id: string;
  agent_name: string;
  response_engine?: { 
    type: string;
    llm_id?: string;
  };
  prompt?: string;
  welcome_message?: string;
  language?: string;
  knowledge_base?: string;
  speech_settings?: {
    stability: number;
    similarity: number;
    style: number;
    speed: number;
  };
  functions?: RetellFunction[];
  last_modification_timestamp?: number;
  [key: string]: any;
}

export interface RetellFunction {
  id: string;
  name: string;
  description: string;
  parameters?: any;
  [key: string]: any;
}

export interface RetellVoice {
  id: string;
  name: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface RetellFolder {
  id: string;
  name: string;
  [key: string]: any;
}

export interface RetellLLM {
  id: string;
  name: string;
  [key: string]: any;
}

export interface RetellPhoneNumber {
  id: string;
  phone_number: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  [key: string]: any;
}
