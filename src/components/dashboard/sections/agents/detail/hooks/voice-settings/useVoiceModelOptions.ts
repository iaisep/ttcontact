
import { VoiceModelOption } from './types';

export function useVoiceModelOptions(): VoiceModelOption[] {
  // Voice model options with proper typing
  const voiceModelOptions: VoiceModelOption[] = [
    { value: 'eleven_turbo_v2', label: 'Auto(Elevenlabs Turbo V2)', id: 'eleven_turbo_v2', description: 'English only, fast, high quality' },
    { value: 'eleven_turbo_v2', label: 'Elevenlabs Turbo V2', id: 'eleven_turbo_v2-normal', description: 'English only, fast, high quality' },
    { value: 'eleven_flash_v2', label: 'Elevenlabs Flash V2', id: 'eleven_flash_v2', description: 'English only, fastest, medium quality' },
    { value: 'eleven_turbo_v2_5', label: 'Elevenlabs Turbo V2.5', id: 'eleven_turbo_v2_5', description: 'Multilingual, fast, high quality' },
    { value: 'eleven_flash_v2_5', label: 'Elevenlabs Flash V2.5', id: 'eleven_flash_v2_5', description: 'Multilingual, fastest, medium quality' },
    { value: 'eleven_multilingual_v2', label: 'Elevenlabs Multilingual v2', id: 'eleven_multilingual_v2', description: 'Multilingual, slow, highest quality' },
  ];
  
  return voiceModelOptions;
}
