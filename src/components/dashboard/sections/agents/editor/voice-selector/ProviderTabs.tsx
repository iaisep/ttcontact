
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProviderTabsProps {
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  children: React.ReactNode;
}

const ProviderTabs: React.FC<ProviderTabsProps> = ({
  activeProvider,
  setActiveProvider,
  children
}) => {
  return (
    <Tabs value={activeProvider} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger 
          value="elevenlabs" 
          onClick={() => setActiveProvider('elevenlabs')}
        >
          ElevenLabs
        </TabsTrigger>
        <TabsTrigger 
          value="playht" 
          onClick={() => setActiveProvider('playht')}
        >
          PlayHT
        </TabsTrigger>
        <TabsTrigger 
          value="openai" 
          onClick={() => setActiveProvider('openai')}
        >
          OpenAI
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeProvider} className="mt-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default ProviderTabs;
