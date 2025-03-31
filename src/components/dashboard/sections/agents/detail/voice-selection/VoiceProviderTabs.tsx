
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VoiceProviderTabsProps {
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  children: React.ReactNode;
}

const VoiceProviderTabs: React.FC<VoiceProviderTabsProps> = ({
  activeProvider,
  setActiveProvider,
  children
}) => {
  return (
    <Tabs defaultValue={activeProvider} className="w-full">
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
        {children}
      </div>
    </Tabs>
  );
};

export default VoiceProviderTabs;
