
export interface Voice {
  id: string;
  name: string;
  provider: string;
  traits: string[];
  avatar_url?: string;
  voice_id: string;
}

export const mockVoices: Voice[] = [
  { 
    id: '1', 
    name: 'Adrian', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Adrian'
  },
  { 
    id: '2', 
    name: 'Amritanshu (en-IN)', 
    provider: 'ElevenLabs', 
    traits: ['Indian', 'Middle Aged', 'Provider', 'Male'],
    voice_id: '11labs-Amritanshu'
  },
  { 
    id: '3', 
    name: 'Amy(UK)', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Young', 'Provider', 'Female'],
    voice_id: '11labs-Amy'
  },
  { 
    id: '4', 
    name: 'Andrea', 
    provider: 'Custom', 
    traits: ['Custom', 'Female'],
    voice_id: 'custom_voice_0586aed08dfec4bef4c9f8b25d'
  },
  { 
    id: '5', 
    name: 'Andrew', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Andrew'
  },
  { 
    id: '6', 
    name: 'Angie vendedora Colombiana', 
    provider: 'Custom', 
    traits: ['Custom', 'Female'],
    voice_id: 'custom_voice_b7f9d4e2175e188767738b4a1c'
  },
  { 
    id: '7', 
    name: 'Anna', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Female'],
    voice_id: '11labs-Anna'
  },
  { 
    id: '8', 
    name: 'Anthony', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Middle Aged', 'Retail', 'Male'],
    voice_id: '11labs-Anthony'
  },
  { 
    id: '9', 
    name: 'Billy', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail', 'Male'],
    voice_id: '11labs-Billy'
  },
  { 
    id: '10', 
    name: 'Charlie', 
    provider: 'PlayHT', 
    traits: ['American', 'Young', 'Provider', 'Male'],
    voice_id: 'playht-Charlie'
  },
  { 
    id: '11', 
    name: 'Emily', 
    provider: 'PlayHT', 
    traits: ['British', 'Young', 'Provider', 'Female'],
    voice_id: 'playht-Emily'
  },
  { 
    id: '12', 
    name: 'Sarah', 
    provider: 'OpenAI', 
    traits: ['American', 'Middle Aged', 'Provider', 'Female'],
    voice_id: 'openai-Sarah'
  }
];
