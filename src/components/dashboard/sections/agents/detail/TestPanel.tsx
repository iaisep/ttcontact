
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import { Phone, TestTube, Mic } from 'lucide-react';
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
      setIsRecording(false);
      toast.info(t('processing_test'));
      
      setTimeout(() => {
        toast.success(t('test_complete'));
      }, 2000);
    } else {
      setIsRecording(true);
      toast.info(t('test_started'));
      
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          toast.success(t('test_complete'));
        }
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={handleAudioTest} className="w-full flex items-center justify-center" disabled={isLoading}>
          <Phone className="mr-2 h-4 w-4" /> 
          {t('audio')}
        </Button>
        
        <Button variant="outline" onClick={handleLlmTest} className="w-full flex items-center justify-center" disabled={isLoading}>
          <TestTube className="mr-2 h-4 w-4" /> 
          {t('llm')}
        </Button>
        
        <Button variant="outline" onClick={handleCodeTest} className="w-full flex items-center justify-center" disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2 h-4 w-4">
            <path d="M4 14.5V11.725C4 11.4266 3.88147 11.1405 3.6705 10.9295C3.45952 10.7185 3.17337 10.6 2.875 10.6H2.5V9.4H2.875C3.02274 9.4 3.16903 9.3709 3.30552 9.31436C3.44201 9.25783 3.56603 9.17496 3.6705 9.0705C3.77496 8.96603 3.85783 8.84201 3.91436 8.70552C3.9709 8.56903 4 8.42274 4 8.275V5.5C4 4.90326 4.23705 4.33097 4.65901 3.90901C5.08097 3.48705 5.65326 3.25 6.25 3.25H7V4.75H6.25C6.05109 4.75 5.86032 4.82902 5.71967 4.96967C5.57902 5.11032 5.5 5.30109 5.5 5.5V8.575C5.50008 8.89076 5.40051 9.19849 5.21548 9.45435C5.03045 9.71022 4.76939 9.90117 4.4695 10C4.76939 10.0988 5.03045 10.2898 5.21548 10.5456C5.40051 10.8015 5.50008 11.1092 5.5 11.425V14.5C5.5 14.6989 5.57902 14.8897 5.71967 15.0303C5.86032 15.171 6.05109 15.25 6.25 15.25H7V16.75H6.25C5.65326 16.75 5.08097 16.5129 4.65901 16.091C4.23705 15.669 4 15.0967 4 14.5ZM16 11.725V14.5C16 15.0967 15.7629 15.669 15.341 16.091C14.919 16.5129 14.3467 16.75 13.75 16.75H13V15.25H13.75C13.9489 15.25 14.1397 15.171 14.2803 15.0303C14.421 14.8897 14.5 14.6989 14.5 14.5V11.425C14.4999 11.1092 14.5995 10.8015 14.7845 10.5456C14.9696 10.2898 15.2306 10.0988 15.5305 10C15.2306 9.90117 14.9696 9.71022 14.7845 9.45435C14.5995 9.19849 14.4999 8.89076 14.5 8.575V5.5C14.5 5.30109 14.421 5.11032 14.2803 4.96967C14.1397 4.82902 13.9489 4.75 13.75 4.75H13V3.25H13.75C14.3467 3.25 14.919 3.48705 15.341 3.90901C15.7629 4.33097 16 4.90326 16 5.5V8.275C16 8.57337 16.1185 8.85952 16.3295 9.0705C16.5405 9.28147 16.8266 9.4 17.125 9.4H17.5V10.6H17.125C16.8266 10.6 16.5405 10.7185 16.3295 10.9295C16.1185 11.1405 16 11.4266 16 11.725Z" fill="black"/>
          </svg>
          {t('code')}
        </Button>
      </div>
      
      <div className="mb-4 rounded-full bg-gray-100 p-6 flex items-center justify-center">
        <Mic className="h-8 w-8 text-gray-400" />
      </div>
      
      <p className="text-gray-500 mb-4">{t('test_your_agent')}</p>
      
      <Button 
        onClick={handleFullTest}
        variant="default"
        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
        disabled={isLoading && !isRecording}
      >
        {t('test')}
      </Button>
    </div>
  );
};

export default TestPanel;
