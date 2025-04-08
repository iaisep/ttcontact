
export interface RetellAgent {
  agent_id: string;
  agent_name: string;
  last_modification_timestamp: number;
  voice_id: string;
  voice_model?: string;
  voice_temperature?: number;
  voice_speed?: number;
  volume?: number;
  enable_backchannel?: boolean;
  backchannel_words?: string[];
  reminder_trigger_ms?: number;
  reminder_max_count?: number;
  interruption_sensitivity?: number;
  ambient_sound?: string;
  ambient_sound_volume?: number;
  response_engine?: { 
    type: string;
    llm_id?: string;
  };
  webhook_url?: string;
  boosted_keywords?: string[];
  responsiveness?: number;
  language?: string;
  opt_out_sensitive_data_storage?: boolean;
  normalize_for_speech?: boolean;
  end_call_after_silence_ms?: number;
  enable_voicemail_detection?: boolean;
  voicemail_message?: string;
  post_call_analysis_data?: PostCallAnalysisItem[];
  max_call_duration_ms?: number;
  voicemail_detection_timeout_ms?: number;
  begin_message_delay_ms?: number;
  post_call_analysis_model?: string;
  enable_transcription_formatting?: boolean;
  description?: string;
  prompt?: string;
  welcome_message?: string;
  knowledge_base?: string;
  knowledge_base_ids?: string[];
  speech_settings?: {
    stability: number;
    similarity: number;
    style: number;
    speed: number;
  };
  functions?: RetellFunction[];
  folder?: string;
  
  // Additional properties for backward compatibility
  name?: string;
  id?: string;
  avatar_url?: string;
  llm_id?: string;
  voice?: {
    name: string;
    avatar_url?: string;
  };
}

export interface PostCallAnalysisItem {
  type: string;
  name: string;
  description: string;
  examples?: string[];
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
  voice_id?: string;
  name: string;
  voice_name?: string;
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
  general_prompt?: string;
  [key: string]: any;
}

export interface RetellPhoneNumber {
  id: string;
  phone_number: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  [key: string]: any;
}
