
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceTableRowProps {
  voice: RetellVoice;
  onSelect: () => void;
  isSelected: boolean;
}

const VoiceTableRow: React.FC<VoiceTableRowProps> = ({ voice, onSelect, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!audioRef.current) {
      audioRef.current = new Audio(voice.preview_audio_url);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={onSelect}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={voice.avatar_url} alt={voice.voice_name || voice.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(voice.voice_name || voice.name || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{voice.voice_name || voice.name}</div>
            <div className="text-xs text-muted-foreground">{voice.voice_id}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {voice.gender && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              {voice.gender}
            </Badge>
          )}
          {voice.accent && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              {voice.accent}
            </Badge>
          )}
          {voice.age && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              {voice.age}
            </Badge>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex justify-end items-center gap-2">
          {voice.preview_audio_url && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button 
            size="sm"
            onClick={onSelect}
            variant={isSelected ? "default" : "outline"}
            className="rounded-full px-4"
          >
            {isSelected ? "Selected" : "Use Voice"}
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default VoiceTableRow;
