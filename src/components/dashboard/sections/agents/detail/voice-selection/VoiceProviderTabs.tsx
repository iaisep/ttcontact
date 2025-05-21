
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VoiceProviderTabsProps {
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  children: React.ReactNode;
  onVoiceAdded?: () => void;
}

const VoiceProviderTabs: React.FC<VoiceProviderTabsProps> = ({
  activeProvider,
  setActiveProvider,
  children,
  onVoiceAdded
}) => {
  // Listen for voiceAdded custom event
  useEffect(() => {
    const handleVoiceAdded = (event: CustomEvent) => {
      console.log('Voice added event received:', event.detail);
      // Call the onVoiceAdded callback if provided
      if (onVoiceAdded) {
        onVoiceAdded();
      }
    };

    // Add event listener with proper typing
    window.addEventListener('voiceAdded', handleVoiceAdded as EventListener);
    
    // Cleanup the event listener
    return () => {
      window.removeEventListener('voiceAdded', handleVoiceAdded as EventListener);
    };
  }, [onVoiceAdded]);

  return (
    <Tabs value={activeProvider} className="w-full h-full flex flex-col">
      <TabsList className="flex w-full h-10 border-b rounded-none bg-transparent">
        <TabsTrigger 
          value="elevenlabs" 
          onClick={() => setActiveProvider('elevenlabs')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          ElevenLabs
        </TabsTrigger>
        <TabsTrigger 
          value="play" 
          onClick={() => setActiveProvider('play')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          PlayHT
        </TabsTrigger>
        <TabsTrigger 
          value="openai" 
          onClick={() => setActiveProvider('openai')}
          className="flex-1 text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium bg-transparent hover:bg-gray-50"
        >
          OpenAI
        </TabsTrigger>
      </TabsList>
      
      <div className="p-4 overflow-y-auto flex-1">
        {children}
      </div>
    </Tabs>
  );
};

export default VoiceProviderTabs;
