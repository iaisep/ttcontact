
import React, { useState, useRef } from 'react';
import VoiceCard from './VoiceCard';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

interface VoiceGridProps {
  voices: Voice[];
  selectedVoiceId: string | undefined;
  onSelectVoice: (voice: Voice) => void;
}

const VoiceGrid: React.FC<VoiceGridProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handlePlayPause = (e: React.MouseEvent, voice: Voice) => {
    e.stopPropagation();
    const voiceId = voice.id;
    
    // If already playing this voice, pause it
    if (playingVoiceId === voiceId) {
      const audio = audioRefs.current.get(voiceId);
      if (audio) {
        audio.pause();
        setPlayingVoiceId(null);
      }
      return;
    }
    
    // If playing a different voice, pause that one first
    if (playingVoiceId && audioRefs.current.has(playingVoiceId)) {
      const currentAudio = audioRefs.current.get(playingVoiceId);
      if (currentAudio) {
        currentAudio.pause();
      }
    }
    
    // Play the new voice
    if (!audioRefs.current.has(voiceId) && voice.preview_audio_url) {
      const audio = new Audio(voice.preview_audio_url);
      
      audio.onended = () => {
        setPlayingVoiceId(null);
      };
      
      audioRefs.current.set(voiceId, audio);
    }
    
    const audioToPlay = audioRefs.current.get(voiceId);
    if (audioToPlay) {
      audioToPlay.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setPlayingVoiceId(voiceId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {voices.map((voice) => (
        <VoiceCard
          key={voice.id}
          voice={voice}
          isSelected={selectedVoiceId === voice.id}
          onSelect={() => onSelectVoice(voice)}
          isPlaying={playingVoiceId === voice.id}
          onPlayPause={(e) => handlePlayPause(e, voice)}
        />
      ))}
    </div>
  );
};

export default VoiceGrid;
