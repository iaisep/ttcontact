
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

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
  // Extract traits from voice properties
  const getTraits = () => {
    const traits = [];
    
    if (voice.gender) traits.push(voice.gender);
    if (voice.accent) traits.push(voice.accent);
    if (voice.age) traits.push(voice.age);
    if (voice.provider) traits.push(voice.provider);
    
    return traits.filter(Boolean).slice(0, 3); // Limit to 3 traits
  };
  
  const traits = getTraits();
  const displayName = voice.name || 'Unnamed Voice';
  const voiceId = voice.id || 'unknown-id';
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <div className="grid grid-cols-4 p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-amber-500">
          {voice.avatar_url ? (
            <AvatarImage src={voice.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-amber-500 text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="font-medium">{displayName}</span>
      </div>
      
      <div className="flex items-center gap-1 flex-wrap">
        {traits.length > 0 ? (
          traits.map((trait, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 truncate"
            >
              {trait}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500">No traits</span>
        )}
      </div>
      
      <div className="flex items-center">
        <span className="text-xs text-gray-500 truncate">{voiceId}</span>
      </div>
      
      <div className="flex items-center justify-end">
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
