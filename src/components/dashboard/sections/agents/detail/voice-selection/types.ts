
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
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Adrian'
  },
  { 
    id: '2', 
    name: 'Amritanshu (en-IN)', 
    provider: 'ElevenLabs', 
    traits: ['Indian', 'Middle Aged', 'Provider'],
    voice_id: '11labs-Amritanshu'
  },
  { 
    id: '3', 
    name: 'Amy(UK)', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Young', 'Provider'],
    voice_id: '11labs-Amy'
  },
  { 
    id: '4', 
    name: 'Andrea', 
    provider: 'Custom', 
    traits: ['Custom'],
    voice_id: 'custom_voice_0586aed08dfec4bef4c9f8b25d'
  },
  { 
    id: '5', 
    name: 'Andrew', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Andrew'
  },
  { 
    id: '6', 
    name: 'Angie vendedora Colombiana', 
    provider: 'Custom', 
    traits: ['Custom'],
    voice_id: 'custom_voice_b7f9d4e2175e188767738b4a1c'
  },
  { 
    id: '7', 
    name: 'Anna', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Anna'
  },
  { 
    id: '8', 
    name: 'Anthony', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Middle Aged', 'Retail'],
    voice_id: '11labs-Anthony'
  }
];
