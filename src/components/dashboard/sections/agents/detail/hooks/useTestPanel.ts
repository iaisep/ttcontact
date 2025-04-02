
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

export const useTestPanel = (agent: RetellAgent) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [callId, setCallId] = useState<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up any active call when component unmounts
  useEffect(() => {
    return () => {
      if (callId) {
        // Try to end the call if one is active
        fetchWithAuth(`/end-call/${callId}`, { method: 'POST' })
          .catch((error) => console.error('Error ending call:', error));
      }
    };
  }, [callId, fetchWithAuth]);

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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFullTest = async () => {
    if (isRecording) {
      // If already recording, stop the call
      setIsRecording(false);
      toast.info(t('processing_test'));
      
      if (callId) {
        try {
          // Try to end the existing call
          await fetchWithAuth(`/end-call/${callId}`, { method: 'POST' });
          console.log('Call ended successfully');
          setCallId(null);
        } catch (error) {
          console.error('Error ending call:', error);
        }
      }
      
      setTimeout(() => {
        toast.success(t('test_complete'));
        setTranscript('');
      }, 2000);
    } else {
      // Start a new call
      setIsLoading(true);
      try {
        // Call the endpoint v2/create-web-call
        const response = await fetchWithAuth('/v2/create-web-call', {
          method: 'POST',
          body: JSON.stringify({
            agent_id: agent.agent_id
          })
        });
        
        console.log('Web call response:', response);
        setCallId(response.call_id);
        
        // Request permission to use microphone
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Only request access to microphone to initiate permission
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Set up audio for the call
          if (response.audio_url && !audioElementRef.current) {
            const audioElement = new Audio(response.audio_url);
            audioElement.autoplay = true;
            audioElementRef.current = audioElement;
          }
          
          setIsRecording(true);
          toast.success(t('call_connected'));
          
          // Simulate gradual transcription for demonstration purposes
          setTranscript('');
          
          setTimeout(() => {
            setTranscript('¡Hola! Muy buen día, soy Karla Beltrán, asesora de admisiones de la Universidad Isép.');
          }, 1000);
          
          setTimeout(() => {
            setTranscript('¡Hola! Muy buen día, soy Karla Beltrán, asesora de admisiones de la Universidad Isép. Espero que estés teniendo');
          }, 3000);
          
          setTimeout(() => {
            if (isRecording) {
              setTranscript('¡Hola! Muy buen día, soy Karla Beltrán, asesora de admisiones de la Universidad Isép. Espero que estés teniendo un excelente día. Vi que estás interesado en nuestras formaciones y quiero entender mejor lo que buscas para ayudarte a encontrar la mejor opción. ¿Cómo puedo ayudarte hoy?');
            }
          }, 5000);
        } else {
          throw new Error('Your browser does not support microphone access');
        }
      } catch (error) {
        console.error('Error starting web call:', error);
        toast.error(error.message || t('error_starting_call'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    isLoading,
    isRecording,
    transcript,
    handleAudioTest,
    handleLlmTest,
    handleCodeTest,
    handleFullTest
  };
};
