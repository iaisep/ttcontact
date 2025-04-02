
import React from 'react';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Voice } from '@/components/dashboard/sections/agents/detail/voice-selection/types';

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  onPlayPause: (e: React.MouseEvent) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  onSelect,
  isPlaying,
  onPlayPause,
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-3 cursor-pointer transition-colors',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={voice.avatar_url} alt={voice.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(voice.name || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{voice.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{voice.id}</p>
        </div>
        {isSelected && (
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
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

      <div className="flex justify-between items-center">
        {voice.preview_audio_url ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-full p-0"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-8" />
        )}

        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className="rounded-full text-xs"
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceCard;
