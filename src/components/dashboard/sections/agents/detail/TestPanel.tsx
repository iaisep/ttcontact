
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Mic, Phone, TestTube, Code } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface TestPanelProps {
  agent: RetellAgent;
  voice?: RetellVoice;
}

const TestPanel: React.FC<TestPanelProps> = ({ agent, voice }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAudioTest = async () => {
    setIsLoading(true);
    try {
      // Implement audio test functionality
      toast.info(t('testing_audio'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t('audio_test_complete'));
    } catch (error) {
      console.error('Error testing audio:', error);
      toast.error(t('error_testing_audio'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLlmTest = async () => {
    setIsLoading(true);
    try {
      // Implement LLM test functionality
      toast.info(t('testing_llm'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t('llm_test_complete'));
    } catch (error) {
      console.error('Error testing LLM:', error);
      toast.error(t('error_testing_llm'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCodeTest = async () => {
    setIsLoading(true);
    try {
      toast.info(t('testing_code'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t('code_test_complete'));
    } catch (error) {
      console.error('Error testing code:', error);
      toast.error(t('error_testing_code'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFullTest = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.info(t('processing_test'));
      
      // Simulate processing delay
      setTimeout(() => {
        toast.success(t('test_complete'));
      }, 2000);
    } else {
      // Start full test
      setIsRecording(true);
      toast.info(t('test_started'));
      
      // Simulate test for 5 seconds
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          toast.success(t('test_complete'));
        }
      }, 5000);
    }
  };

  return (
    <div className="border rounded-lg px-2 mb-2 py-4">
      {/* Test Action Buttons */}
      <div className="w-full flex gap-2 mb-10 px-4">
        <Button variant="outline" onClick={handleAudioTest} className="flex-1" disabled={isLoading}>
          <Phone className="mr-2 h-4 w-4" /> 
          {t('test_audio')}
        </Button>
        
        <Button variant="outline" onClick={handleLlmTest} className="flex-1" disabled={isLoading}>
          <TestTube className="mr-2 h-4 w-4" /> 
          {t('test_llm')}
        </Button>
        
        <Button variant="outline" onClick={handleCodeTest} disabled={isLoading}>
          <Code className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Microphone Icon */}
      <div className="mb-4 rounded-full bg-gray-100 p-6 flex items-center justify-center">
        <Mic className="h-8 w-8 text-gray-400" />
      </div>
      
      {/* Test Label */}
      <p className="text-gray-500 mb-4 text-center">{t('test_your_agent')}</p>
      
      {/* Test Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleFullTest}
          variant="default"
          className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
          disabled={isLoading && !isRecording}
        >
          {t('test')}
        </Button>
      </div>
    </div>
  );
};

export default TestPanel;
