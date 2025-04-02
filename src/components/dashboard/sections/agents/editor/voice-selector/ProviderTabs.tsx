
import React, { useEffect } from 'react';
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
  // Effect to fetch voices when provider changes
  useEffect(() => {
    // This effect could trigger a refetch if needed
  }, [activeProvider]);

  const handleProviderChange = (provider: string) => {
    setActiveProvider(provider);
  };

  return (
    <Tabs value={activeProvider} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger 
          value="elevenlabs" 
          onClick={() => handleProviderChange('elevenlabs')}
        >
          ElevenLabs
        </TabsTrigger>
        <TabsTrigger 
          value="playht" 
          onClick={() => handleProviderChange('playht')}
        >
          PlayHT
        </TabsTrigger>
        <TabsTrigger 
          value="openai" 
          onClick={() => handleProviderChange('openai')}
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
