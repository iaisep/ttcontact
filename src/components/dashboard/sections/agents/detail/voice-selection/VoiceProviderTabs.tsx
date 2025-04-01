
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
      <TabsList className="flex w-full h-10 border-b rounded-none bg-transparent">
        <TabsTrigger 
          value="ElevenLabs" 
          onClick={() => setActiveProvider('ElevenLabs')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          ElevenLabs
        </TabsTrigger>
        <TabsTrigger 
          value="PlayHT" 
          onClick={() => setActiveProvider('PlayHT')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          PlayHT
        </TabsTrigger>
        <TabsTrigger 
          value="OpenAI" 
          onClick={() => setActiveProvider('OpenAI')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          OpenAI
        </TabsTrigger>
      </TabsList>
      
      <div className="px-6 py-4">
        {children}
      </div>
    </Tabs>
  );
};

export default VoiceProviderTabs;
