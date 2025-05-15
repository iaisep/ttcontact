
import React, { useState } from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTestPanel } from '../../hooks/useTestPanel';
import TestButtons from './TestButtons';
import TranscriptPanel from '../TranscriptPanel';
import TestControlButton from '../TestControlButton';

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
        agentId={agent?.agent_id || agent?.id}
      />
      
      <TranscriptPanel 
        transcript={transcript} 
        isVisible={transcript !== '' || isRecording} 
      />
      
      <div className="w-full flex justify-between items-center px-2 mb-1">
        {/* Volume control and timer removed/commented */}
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
