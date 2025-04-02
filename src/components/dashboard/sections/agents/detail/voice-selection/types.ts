
export interface Voice {
  id: string;
  name: string;
  provider: string;
  traits: string[];
  avatar_url?: string;
  voice_id: string;
  gender?: string;
  accent?: string;
  age?: string;
  preview_audio_url?: string;
}

export const mockVoices: Voice[] = [
  { 
    id: '1', 
    name: 'Adrian', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Adrian',
    gender: 'Male',
    accent: 'American',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/adrian.mp3'
  },
  { 
    id: '2', 
    name: 'Amritanshu (en-IN)', 
    provider: 'ElevenLabs', 
    traits: ['Indian', 'Middle Aged', 'Provider', 'Male'],
    voice_id: '11labs-Amritanshu',
    gender: 'Male',
    accent: 'Indian',
    age: 'Middle Aged',
    preview_audio_url: 'https://example.com/audio/amritanshu.mp3'
  },
  { 
    id: '3', 
    name: 'Amy(UK)', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Young', 'Provider', 'Female'],
    voice_id: '11labs-Amy',
    gender: 'Female',
    accent: 'British',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/amy.mp3'
  },
  { 
    id: '4', 
    name: 'Andrea', 
    provider: 'Custom', 
    traits: ['Custom', 'Female'],
    voice_id: 'custom_voice_0586aed08dfec4bef4c9f8b25d',
    gender: 'Female',
    preview_audio_url: 'https://example.com/audio/andrea.mp3'
  },
  { 
    id: '5', 
    name: 'Andrew', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Andrew',
    gender: 'Male',
    accent: 'American',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/andrew.mp3'
  },
  { 
    id: '6', 
    name: 'Angie vendedora Colombiana', 
    provider: 'Custom', 
    traits: ['Custom', 'Female'],
    voice_id: 'custom_voice_b7f9d4e2175e188767738b4a1c',
    gender: 'Female',
    accent: 'Colombian',
    preview_audio_url: 'https://example.com/audio/angie.mp3'
  },
  { 
    id: '7', 
    name: 'Anna', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Female'],
    voice_id: '11labs-Anna',
    gender: 'Female',
    accent: 'American',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/anna.mp3'
  },
  { 
    id: '8', 
    name: 'Anthony', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Middle Aged', 'Retail', 'Male'],
    voice_id: '11labs-Anthony',
    gender: 'Male',
    accent: 'British',
    age: 'Middle Aged',
    preview_audio_url: 'https://example.com/audio/anthony.mp3'
  },
  { 
    id: '9', 
    name: 'Billy', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Billy',
    gender: 'Male',
    accent: 'American',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/billy.mp3'
  },
  { 
    id: '10', 
    name: 'Charlie', 
    provider: 'PlayHT', 
    traits: ['American', 'Young', 'Provider', 'Male'],
    voice_id: 'playht-Charlie',
    gender: 'Male',
    accent: 'American',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/charlie.mp3'
  },
  { 
    id: '11', 
    name: 'Emily', 
    provider: 'PlayHT', 
    traits: ['British', 'Young', 'Provider', 'Female'],
    voice_id: 'playht-Emily',
    gender: 'Female',
    accent: 'British',
    age: 'Young',
    preview_audio_url: 'https://example.com/audio/emily.mp3'
  },
  { 
    id: '12', 
    name: 'Sarah', 
    provider: 'OpenAI', 
    traits: ['American', 'Middle Aged', 'Provider', 'Female'],
    voice_id: 'openai-Sarah',
    gender: 'Female',
    accent: 'American',
    age: 'Middle Aged',
    preview_audio_url: 'https://example.com/audio/sarah.mp3'
  }
];
