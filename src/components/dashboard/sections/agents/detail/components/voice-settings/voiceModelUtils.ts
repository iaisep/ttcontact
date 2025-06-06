
// Voice model language compatibility based on ElevenLabs documentation
export interface VoiceModelCompatibility {
  id: string;
  label: string;
  description: string;
  supportedLanguages: string[];
  quality: 'high' | 'medium';
  latency: string;
  alwaysAvailable?: boolean; // Nueva propiedad para modelos que siempre deben estar disponibles
}

export const VOICE_MODELS: VoiceModelCompatibility[] = [
  {
    id: 'auto',
    label: 'Auto(Elevenlabs Turbo V2)',
    description: 'English only, fast, high quality',
    supportedLanguages: ['en-US', 'en-GB', 'en-IN'],
    quality: 'high',
    latency: '~300 ms',
    alwaysAvailable: true // Este modelo siempre debe estar disponible
  },
  {
    id: 'eleven_turbo_v2',
    label: 'Elevenlabs Turbo V2',
    description: 'English only, fast, high quality',
    supportedLanguages: ['en-US', 'en-GB', 'en-IN'],
    quality: 'high',
    latency: '~300 ms'
  },
  {
    id: 'eleven_flash_v2',
    label: 'Elevenlabs Flash V2',
    description: 'English only, fastest, medium quality',
    supportedLanguages: ['en-US', 'en-GB', 'en-IN'],
    quality: 'medium',
    latency: '~75 ms'
  },
  {
    id: 'eleven_turbo_v2_5',
    label: 'Elevenlabs Turbo V2.5',
    description: 'Multilingual, fast, high quality',
    supportedLanguages: [
      'en-US', 'en-GB', 'en-IN',
      'es-ES', 'es-419',
      'pt-PT', 'pt-BR',
      'fr-FR',
      'de-DE',
      'it-IT',
      'ja-JP',
      'zh-CN',
      'ko-KR',
      'hi-IN',
      'ru-RU',
      'vi-VN',
      'pl-PL',
      'ro-RO',
      'tr-TR',
      'nl-NL',
      'multi'
    ],
    quality: 'high',
    latency: '~300 ms'
  },
  {
    id: 'eleven_flash_v2_5',
    label: 'Elevenlabs Flash V2.5',
    description: 'Multilingual, fastest, medium quality',
    supportedLanguages: [
      'en-US', 'en-GB', 'en-IN',
      'es-ES', 'es-419',
      'pt-PT', 'pt-BR',
      'fr-FR',
      'de-DE',
      'it-IT',
      'ja-JP',
      'zh-CN',
      'ko-KR',
      'hi-IN',
      'ru-RU',
      'vi-VN',
      'pl-PL',
      'ro-RO',
      'tr-TR',
      'nl-NL',
      'multi'
    ],
    quality: 'medium',
    latency: '~75 ms'
  },
  {
    id: 'eleven_multilingual_v2',
    label: 'Elevenlabs Multilingual v2',
    description: 'Multilingual, slow, highest quality',
    supportedLanguages: [
      'en-US', 'en-GB', 'en-IN',
      'es-ES', 'es-419',
      'pt-PT', 'pt-BR',
      'fr-FR',
      'de-DE',
      'it-IT',
      'ja-JP',
      'zh-CN',
      'ko-KR',
      'hi-IN',
      'ru-RU',
      'vi-VN',
      'pl-PL',
      'ro-RO',
      'tr-TR',
      'nl-NL',
      'multi'
    ],
    quality: 'high',
    latency: '~500 ms'
  }
];

export function getCompatibleVoiceModels(selectedLanguage: string): VoiceModelCompatibility[] {
  return VOICE_MODELS.filter(model => 
    model.alwaysAvailable || // Los modelos marcados como "siempre disponibles" se incluyen
    model.supportedLanguages.includes(selectedLanguage) || 
    model.supportedLanguages.includes('multi')
  );
}
