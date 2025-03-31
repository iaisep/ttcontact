
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-muted-foreground/10 w-24 h-24 flex items-center justify-center mb-4">
        <Mic className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">Test your agent</p>
      </div>
      <Button 
        onClick={handleVoiceTest}
        variant="default"
        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
      >
        Test
      </Button>

      {responseText && (
        <div className="mt-6 w-full border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">{t('agent_response')}</h4>
          <p className="text-sm">{responseText}</p>
          
          {audioUrl && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={playAudio}>
                <Play size={16} className="mr-2" />
                {t('play_audio')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestPanel;
