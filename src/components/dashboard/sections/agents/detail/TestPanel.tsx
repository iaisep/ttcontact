
import React from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTestPanel } from './hooks/useTestPanel';
import TestButtons from './components/TestButtons';
import TranscriptPanel from './components/TranscriptPanel';
import TestControlButton from './components/TestControlButton';

interface TestPanelProps {
  agent: RetellAgent;
  voice?: RetellVoice;
}

const TestPanel: React.FC<TestPanelProps> = ({ agent, voice }) => {
  const { t } = useLanguage();
  const {
    isLoading,
    isRecording,
    transcript,
    handleAudioTest,
    handleLlmTest,
    handleCodeTest,
    handleFullTest
  } = useTestPanel(agent);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
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
      
      <div className={`mb-4 rounded-full bg-gray-100 p-6 flex items-center justify-center ${isRecording ? 'bg-red-100 animate-pulse' : ''}`}>
        <Mic className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
      </div>
      
      <p className="text-gray-500 mb-4">{isRecording ? t('listening') : t('test_your_agent')}</p>
      
      <TestControlButton 
        isRecording={isRecording}
        isLoading={isLoading}
        onTest={handleFullTest}
      />
    </div>
  );
};

export default TestPanel;
