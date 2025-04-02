
export interface Voice {
  id: string;
  name: string;
  voice_id?: string;
  provider?: string;
  gender?: string;
  accent?: string;
  age?: string;
  description?: string;
  preview_audio_url?: string;
  avatar_url?: string;
}

export interface VoiceFilterState {
  searchTerm: string;
  gender: string;
  accent: string;
  age: string;
}
