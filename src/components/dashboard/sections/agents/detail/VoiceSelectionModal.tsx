
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X, Plus, Play } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  provider: string;
  traits: string[];
  avatar_url?: string;
  voice_id: string;
}

interface VoiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  selectedVoice?: string;
}

const mockVoices: Voice[] = [
  { 
    id: '1', 
    name: 'Adrian', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Adrian'
  },
  { 
    id: '2', 
    name: 'Amritanshu (en-IN)', 
    provider: 'ElevenLabs', 
    traits: ['Indian', 'Middle Aged', 'Provider'],
    voice_id: '11labs-Amritanshu'
  },
  { 
    id: '3', 
    name: 'Amy(UK)', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Young', 'Provider'],
    voice_id: '11labs-Amy'
  },
  { 
    id: '4', 
    name: 'Andrea', 
    provider: 'Custom', 
    traits: ['Custom'],
    voice_id: 'custom_voice_0586aed08dfec4bef4c9f8b25d'
  },
  { 
    id: '5', 
    name: 'Andrew', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Andrew'
  },
  { 
    id: '6', 
    name: 'Angie vendedora Colombiana', 
    provider: 'Custom', 
    traits: ['Custom'],
    voice_id: 'custom_voice_b7f9d4e2175e188767738b4a1c'
  },
  { 
    id: '7', 
    name: 'Anna', 
    provider: 'ElevenLabs', 
    traits: ['American', 'Young', 'Retail'],
    voice_id: '11labs-Anna'
  },
  { 
    id: '8', 
    name: 'Anthony', 
    provider: 'ElevenLabs', 
    traits: ['British', 'Middle Aged', 'Retail'],
    voice_id: '11labs-Anthony'
  }
];

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  open,
  onClose,
  onSelectVoice,
  selectedVoice
}) => {
  const [activeProvider, setActiveProvider] = useState('ElevenLabs');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [accentFilter, setAccentFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filteredVoices = mockVoices.filter(voice => {
    // Filter by provider
    if (activeProvider !== 'All' && voice.provider !== activeProvider) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !voice.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleSelectVoice = (voice: Voice) => {
    onSelectVoice(voice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[580px] p-0 overflow-hidden">
        <DialogTitle className="px-6 pt-6 pb-2 text-xl font-semibold">
          Select Voice
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        
        <Tabs defaultValue="ElevenLabs" className="w-full">
          <TabsList className="px-6 border-b rounded-none justify-start">
            <TabsTrigger 
              value="ElevenLabs" 
              onClick={() => setActiveProvider('ElevenLabs')}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              ElevenLabs
            </TabsTrigger>
            <TabsTrigger 
              value="PlayHT" 
              onClick={() => setActiveProvider('PlayHT')}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              PlayHT
            </TabsTrigger>
            <TabsTrigger 
              value="OpenAI" 
              onClick={() => setActiveProvider('OpenAI')}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              OpenAI
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="outline" className="gap-2 bg-gray-100">
                <Plus className="h-4 w-4" />
                Add custom voice
              </Button>
              
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={accentFilter} onValueChange={setAccentFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Accent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Accents</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="british">British</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1">
                <Input 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="overflow-auto h-[400px] border rounded-md">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="w-12"></th>
                    <th className="text-left p-2 font-medium">Voice</th>
                    <th className="text-left p-2 font-medium">Trait</th>
                    <th className="text-left p-2 font-medium">Voice ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoices.map((voice) => (
                    <tr 
                      key={voice.id} 
                      onClick={() => handleSelectVoice(voice)}
                      className="hover:bg-gray-50 cursor-pointer border-b"
                    >
                      <td className="p-2 text-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                            {voice.avatar_url ? (
                              <img src={voice.avatar_url} alt={voice.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs">{voice.name.substring(0, 2)}</span>
                            )}
                          </div>
                          <span>{voice.name}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {voice.traits.map((trait, i) => (
                            <span key={i} className="text-xs">
                              {trait}{i < voice.traits.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 font-mono text-xs text-gray-500">
                        {voice.voice_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
