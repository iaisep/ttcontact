
export interface Voice {
  id: string;
  name: string;
  provider?: string;
  gender?: string;
  accent?: string;
  age?: string;
  description?: string;
  preview_audio_url?: string;
}

export interface VoiceFilterState {
  searchTerm: string;
  gender: string;
  accent: string;
  age: string;
}
