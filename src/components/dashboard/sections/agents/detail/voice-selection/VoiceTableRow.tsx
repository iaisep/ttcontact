
import React from 'react';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { User, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VoiceTableRowProps {
  voice: RetellVoice;
  isSelected: boolean;
  onSelect: () => void;
}

const VoiceTableRow: React.FC<VoiceTableRowProps> = ({
  voice,
  isSelected,
  onSelect
}) => {
  // Extract traits from the voice data
  const getTraits = () => {
    const traits = [];
    
    // Add accent
    if (voice.accent) {
      traits.push(voice.accent);
    }
    
    // Add gender
    if (voice.gender) {
      traits.push(voice.gender);
    }
    
    // Add age
    if (voice.age) {
      traits.push(voice.age);
    }
    
    // Add provider as trait
    if (voice.provider) {
      traits.push(voice.provider);
    }
    
    // Add voice type as trait
    if (voice.standard_voice_type) {
      traits.push(voice.standard_voice_type);
    }
    
    return traits;
  };
  
  const traits = getTraits();
  
  // Get badge color based on trait
  const getBadgeVariant = (trait: string): "default" | "secondary" | "outline" | "destructive" => {
    if (trait === 'American' || trait === 'British' || trait === 'Indian') {
      return 'secondary';
    } else if (trait === 'Young' || trait === 'Middle Aged' || trait === 'Old') {
      return 'outline';
    } else if (trait === 'male' || trait === 'female' || trait === 'neutral') {
      return 'default';
    } else {
      return 'outline';
    }
  };
  
  return (
    <div className={`grid grid-cols-4 p-4 border-b hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center gap-3">
        <button 
          className="text-gray-600 hover:text-black" 
          title="Play voice sample"
          onClick={(e) => {
            e.stopPropagation();
            // Play voice sample logic would go here
            // if a preview_audio_url is available
            if (voice.preview_audio_url) {
              const audio = new Audio(voice.preview_audio_url);
              audio.play().catch(err => console.error('Failed to play audio:', err));
            }
          }}
        >
          <Play className="h-4 w-4" />
        </button>
        
        <Avatar className="h-8 w-8">
          {voice.avatar_url ? (
            <AvatarImage src={voice.avatar_url} alt={voice.name} />
          ) : null}
          <AvatarFallback>
            {voice.name ? voice.name.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="font-medium text-gray-800">{voice.name}</div>
      </div>
      
      <div className="flex items-center flex-wrap gap-1.5">
        {traits.map((trait, index) => (
          <Badge 
            key={index}
            variant={getBadgeVariant(trait)}
            className="text-xs px-2 py-0.5"
          >
            {trait}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center text-gray-600 text-sm">{voice.id}</div>
      
      <div className="flex justify-end">
        <Button 
          size="sm"
          onClick={onSelect}
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Selected" : "Use Voice"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceTableRow;
