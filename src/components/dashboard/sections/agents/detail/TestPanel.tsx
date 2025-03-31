
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Mic, Play, TestTube } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface TestPanelProps {
  agent: RetellAgent;
  voice?: RetellVoice;
}

const TestPanel: React.FC<TestPanelProps> = ({ agent, voice }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [testInput, setTestInput] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleTestWithText = async () => {
    if (!testInput.trim()) return;

    setIsLoading(true);
    setResponseText('');
    setAudioUrl(null);

    try {
      // Simulate API call with delay (replace with actual API call)
      const response = await fetchWithAuth('/test-agent', {
        method: 'POST',
        body: JSON.stringify({
          agent_id: agent.agent_id || agent.id,
          input: testInput,
          mode: 'text'
        })
      });

      // Simulate response (replace with actual response handling)
      setTimeout(() => {
        setResponseText("This is a simulated response from the agent. In a real implementation, this would be the actual response from the API.");
        
        // Simulate audio response
        const audio = new Audio("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3");
        audio.play();
        setAudioUrl("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3");
        
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error testing agent:', error);
      toast.error(t('error_testing_agent'));
      setIsLoading(false);
    }
  };

  const handleVoiceTest = () => {
    if (isRecording) {
      // Stop recording logic
      setIsRecording(false);
      toast.info(t('processing_voice_input'));
      
      // Simulate processing delay
      setTimeout(() => {
        setResponseText("This is a simulated response to your voice input. In a real implementation, this would process the recorded audio.");
        setAudioUrl("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-2.mp3");
      }, 2000);
    } else {
      // Start recording logic
      setIsRecording(true);
      setResponseText('');
      setAudioUrl(null);
      toast.info(t('recording_started'));
      
      // Simulate recording for 5 seconds
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          toast.info(t('recording_finished'));
        }
      }, 5000);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" onValueChange={(value) => setTestMode(value)}>
        <TabsList>
          <TabsTrigger value="text">{t('text_test')}</TabsTrigger>
          <TabsTrigger value="voice">{t('voice_test')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('test_input')}</label>
            <Textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={t('test_input_placeholder')}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleTestWithText} 
              disabled={isLoading || !testInput.trim()}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              ) : (
                <TestTube size={16} className="mr-2" />
              )}
              {t('test_agent')}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="voice" className="space-y-4 pt-4">
          <div className="flex justify-center py-8">
            <Button 
              size="lg" 
              onClick={handleVoiceTest}
              className={`rounded-full p-6 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              <Mic size={24} />
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            {isRecording 
              ? t('recording_in_progress')
              : t('press_to_start_recording')}
          </p>
        </TabsContent>
      </Tabs>
      
      {responseText && (
        <div className="mt-8 space-y-4">
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium mb-2">{t('agent_response')}</h4>
            <p>{responseText}</p>
            
            {audioUrl && (
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={playAudio}>
                  <Play size={16} className="mr-2" />
                  {t('play_audio')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPanel;
