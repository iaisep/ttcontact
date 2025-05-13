
import React, { useState } from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Mic, Phone, TestTube, Volume, Clock as ClockIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTestPanel } from '../../hooks/useTestPanel';
import TestButtons from './TestButtons';
import TranscriptPanel from '../TranscriptPanel';
import TestControlButton from '../TestControlButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface TestPanelProps {
  agent: RetellAgent;
  voice?: RetellVoice | null;
}

const TestPanel: React.FC<TestPanelProps> = ({ agent, voice }) => {
  const { t } = useLanguage();
  const [audioVolume, setAudioVolume] = useState<number>(80);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  
  const {
    isLoading,
    isRecording,
    transcript,
    handleAudioTest,
    handleLlmTest,
    handleCodeTest,
    handleFullTest
  } = useTestPanel(agent);

  // Update recording timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Format the timer as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 w-full">
      <TestButtons 
        isLoading={isLoading}
        isRecording={isRecording}
        onAudioTest={handleAudioTest}
        onLlmTest={handleLlmTest}
        onCodeTest={handleCodeTest}
      />
      
      <TranscriptPanel 
        transcript={transcript} 
        isVisible={transcript !== '' || isRecording} 
      />
      
      <div className="w-full flex justify-between items-center px-2 mb-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <Volume className="h-3 w-3 mr-1" />
              <span className="text-xs">{audioVolume}%</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('audio_settings') || 'Audio Settings'}</h4>
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume" className="text-xs">{t('volume') || 'Volume'}</Label>
                  <span className="text-xs text-muted-foreground">{audioVolume}%</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={[audioVolume]}
                  onValueChange={(value) => setAudioVolume(value[0])}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {isRecording && (
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 text-red-500 mr-1" />
            <span className="text-xs text-red-500">{formatTime(recordingDuration)}</span>
          </div>
        )}
      </div>
      
      <div className={`mb-3 rounded-full bg-gray-100 p-5 flex items-center justify-center ${isRecording ? 'bg-red-100 animate-pulse' : ''}`}>
        <Mic className={`h-6 w-6 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
      </div>
      
      <p className="text-gray-500 text-sm mb-1">
        {isRecording ? t('listening') : t('test_your_agent')}
      </p>

      {isRecording && (
        <p className="text-xs text-gray-400 mb-1">
          {t('speak_now') || 'Speak clearly into your microphone'}
        </p>
      )}
      
      <TestControlButton 
        isRecording={isRecording}
        isLoading={isLoading}
        onTest={handleFullTest}
        agentId={agent?.agent_id || agent?.id}
      />
    </div>
  );
};

export default TestPanel;
