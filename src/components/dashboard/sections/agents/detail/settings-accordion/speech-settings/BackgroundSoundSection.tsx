
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Cog, ChevronDown, Check } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

interface BackgroundSoundSectionProps {
  sound?: string;
  volume?: number;
  agentId?: string;
  onUpdateSound?: (value: string) => void;
  onUpdateVolume?: (value: number) => void;
}

const BACKGROUND_SOUNDS = [
  { value: 'coffee-shop', label: 'Coffee Shop' },
  { value: 'convention-hall', label: 'Convention Hall' },
  { value: 'summer-outdoor', label: 'Summer Outdoor' },
  { value: 'mountain-outdoor', label: 'Mountain Outdoor' },
  { value: 'static-noise', label: 'Static Noise' },
  { value: 'call-center', label: 'Call Center' },
  { value: 'none', label: 'None' }
];

export const BackgroundSoundSection: React.FC<BackgroundSoundSectionProps> = ({ 
  sound = 'summer-outdoor',
  volume = 1,
  agentId,
  onUpdateSound,
  onUpdateVolume
}) => {
  const { fetchWithAuth } = useApiContext();
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [currentSound, setCurrentSound] = useState(sound);
  
  // Find the display label for the current sound value
  const soundLabel = BACKGROUND_SOUNDS.find(s => s.value === currentSound)?.label || 'Summer Outdoor';

  const handleSoundChange = async (value: string) => {
    setCurrentSound(value);
    
    if (onUpdateSound) {
      onUpdateSound(value);
    }
    
    if (agentId) {
      try {
        await fetchWithAuth(`/update-agent/${agentId}`, {
          method: 'PATCH',
          body: JSON.stringify({ ambient_sound: value })
        });
        console.log(`Updated agent ${agentId} background sound to ${value}`);
      } catch (error) {
        console.error('Failed to update background sound:', error);
        toast.error('Failed to update background sound');
      }
    }
  };

  const handleVolumeChange = async (value: number[]) => {
    const newVolume = value[0];
    setCurrentVolume(newVolume);
    
    if (onUpdateVolume) {
      onUpdateVolume(newVolume);
    }
    
    if (agentId) {
      try {
        await fetchWithAuth(`/update-agent/${agentId}`, {
          method: 'PATCH',
          body: JSON.stringify({ ambient_sound_volume: newVolume })
        });
        console.log(`Updated agent ${agentId} background sound volume to ${newVolume}`);
      } catch (error) {
        console.error('Failed to update background sound volume:', error);
        toast.error('Failed to update background sound volume');
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Background Sound</Label>
      <div className="flex items-center justify-between">
        <Select value={currentSound} onValueChange={handleSoundChange}>
          <SelectTrigger className="w-full bg-white border-gray-200">
            <SelectValue>{soundLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BACKGROUND_SOUNDS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.value === currentSound && (
                  <Check className="ml-2 h-4 w-4 inline" />
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover open={isVolumeOpen} onOpenChange={setIsVolumeOpen}>
          <PopoverTrigger asChild>
            <button className="ml-2 p-1 rounded hover:bg-gray-100">
              <Cog className="h-4 w-4 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Background Sound Volume</span>
                <span className="text-xs">{currentVolume.toFixed(1)}</span>
              </div>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={[currentVolume]}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BackgroundSoundSection;
