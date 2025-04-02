
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

    // Add language
    if (voice.language) {
      traits.push(voice.language);
    }
    
    return traits.length > 0 ? traits : ['No traits available'];
  };
  
  const traits = getTraits();
  
  // Get badge color based on trait
  const getBadgeVariant = (trait: string): "default" | "secondary" | "outline" | "destructive" => {
    if (trait.toLowerCase().includes('american') || trait.toLowerCase().includes('british') || trait.toLowerCase().includes('indian')) {
      return 'secondary';
    } else if (trait.toLowerCase().includes('young') || trait.toLowerCase().includes('middle') || trait.toLowerCase().includes('old')) {
      return 'outline';
    } else if (trait.toLowerCase().includes('male') || trait.toLowerCase().includes('female') || trait.toLowerCase().includes('neutral')) {
      return 'default';
    } else {
      return 'outline';
    }
  };
  
  return (
    <div className={`grid grid-cols-4 p-4 border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center gap-3">
        {voice.preview_audio_url && (
          <button 
            className="text-gray-600 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors" 
            title="Play voice sample"
            onClick={(e) => {
              e.stopPropagation();
              const audio = new Audio(voice.preview_audio_url);
              audio.play().catch(err => console.error('Failed to play audio:', err));
            }}
          >
            <Play className="h-4 w-4" />
          </button>
        )}
        
        <Avatar className="h-8 w-8 rounded-full border border-gray-200">
          {voice.avatar_url ? (
            <AvatarImage src={voice.avatar_url} alt={voice.name || ''} />
          ) : null}
          <AvatarFallback className="bg-gray-100 text-gray-700">
            {voice.name ? voice.name.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="font-medium text-gray-800 truncate">{voice.name || 'Unnamed Voice'}</div>
      </div>
      
      <div className="flex items-center flex-wrap gap-1.5">
        {traits.map((trait, index) => (
          <Badge 
            key={index}
            variant={getBadgeVariant(trait)}
            className="text-xs px-2 py-0.5 rounded-full"
          >
            {trait}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center text-gray-600 text-sm truncate">{voice.id || 'No ID'}</div>
      
      <div className="flex justify-end">
        <Button 
          size="sm"
          onClick={onSelect}
          variant={isSelected ? "default" : "outline"}
          className="rounded-full px-4"
        >
          {isSelected ? "Selected" : "Use Voice"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceTableRow;
