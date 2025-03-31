
import React, { useState } from 'react';
import { Play, User, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceSelectorProps {
  voices: RetellVoice[];
  currentVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  onClose: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  currentVoiceId,
  onSelectVoice,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [provider, setProvider] = useState('Elevenlabs');
  const [selectedVoiceId, setSelectedVoiceId] = useState(currentVoiceId);
  
  // Filter voices based on search query and selected provider
  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = provider === 'All' || 
      (provider === 'Elevenlabs' && voice.id.includes('11labs')) ||
      (provider === 'PlayHT' && voice.id.includes('playht')) ||
      (provider === 'OpenAI' && voice.id.includes('openai'));
    
    return matchesSearch && matchesProvider;
  });
  
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };
  
  const handleUseVoice = () => {
    onSelectVoice(selectedVoiceId);
    onClose();
  };
  
  // Helper function to determine voice traits
  const getVoiceTraits = (voice: RetellVoice) => {
    const traits = [];
    
    // Extract accent or nationality
    if (voice.name.includes('British') || voice.id.includes('UK')) {
      traits.push('British');
    } else if (voice.name.includes('Indian') || voice.id.includes('IN')) {
      traits.push('Indian');
    } else {
      traits.push('American');
    }
    
    // Age characteristic
    if (voice.name.includes('Elder') || voice.name.includes('Old')) {
      traits.push('Middle Aged');
    } else {
      traits.push('Young');
    }
    
    // Provider or custom identifier
    if (voice.id.includes('custom')) {
      traits.push('Custom');
    } else if (voice.id.includes('retell') || voice.id.includes('11labs')) {
      traits.push('Retell');
    } else {
      traits.push('Provider');
    }
    
    return traits;
  };
  
  const isCustomVoice = (voiceId: string) => {
    return voiceId.includes('custom');
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Select Voice</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="Elevenlabs" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger 
                value="Elevenlabs" 
                onClick={() => setProvider('Elevenlabs')}
              >
                Elevenlabs
              </TabsTrigger>
              <TabsTrigger 
                value="PlayHT" 
                onClick={() => setProvider('PlayHT')}
              >
                PlayHT
              </TabsTrigger>
              <TabsTrigger 
                value="OpenAI" 
                onClick={() => setProvider('OpenAI')}
              >
                OpenAI
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" className="flex gap-2 bg-black text-white hover:bg-gray-800">
              <span>+</span> Add custom voice
            </Button>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Accent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">⌘K</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-3 p-4 border-b bg-gray-50">
              <div className="font-medium">Voice</div>
              <div className="font-medium">Trait</div>
              <div className="font-medium">Voice ID</div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {filteredVoices.map(voice => {
                const traits = getVoiceTraits(voice);
                const isSelected = selectedVoiceId === voice.id;
                
                return (
                  <div 
                    key={voice.id}
                    className={`grid grid-cols-3 p-4 border-b hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={() => handleVoiceSelect(voice.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-gray-600 hover:text-black">
                        <Play className="h-4 w-4" />
                      </button>
                      
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
                        {isCustomVoice(voice.id) ? (
                          <User className="h-4 w-4" />
                        ) : (
                          voice.avatar_url ? (
                            <img src={voice.avatar_url} alt={voice.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold">
                              {voice.name.substring(0, 2).toUpperCase()}
                            </span>
                          )
                        )}
                      </div>
                      
                      <div>{voice.name}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {traits.map((trait, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-2 py-1 rounded ${
                            trait === 'British' ? 'bg-blue-100 text-blue-800' :
                            trait === 'American' ? 'bg-blue-100 text-blue-800' :
                            trait === 'Indian' ? 'bg-amber-100 text-amber-800' :
                            trait === 'Young' ? 'bg-green-100 text-green-800' :
                            trait === 'Middle Aged' ? 'bg-purple-100 text-purple-800' :
                            trait === 'Retell' ? 'bg-indigo-100 text-indigo-800' :
                            trait === 'Provider' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-gray-600">{voice.id}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleUseVoice}
              className="ml-auto"
            >
              Use Voice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelector;
