
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { RetellWebClient } from 'retell-client-js-sdk';

// Definimos la interfaz para la respuesta del registro de llamada
interface RegisterCallResponse {
  access_token: string;
  call_id?: string;
}

interface TestControlButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onTest: () => void;
  agentId?: string;
}

const retellWebClient = new RetellWebClient();

const TestControlButton: React.FC<TestControlButtonProps> = ({
  isRecording,
  isLoading,
  onTest,
  agentId
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [endingCall, setEndingCall] = useState(false);
  
  // Initialize the SDK
  useEffect(() => {
    retellWebClient.on("call_started", () => {
      console.log("call started");
    });
    
    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      onTest(); // Notify parent component that call has ended
    });
    
    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
    });
    
    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
    });
    
    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      toast.error(t('error_in_call') || 'Error in call');
      retellWebClient.stopCall();
    });
    
    // Cleanup function to remove event listeners
    return () => {
      retellWebClient.removeAllListeners();
    };
  }, [onTest, t]);
  
  const handleClick = async () => {
    if (isRecording) {
      // End the call directly using the SDK
      setEndingCall(true);
      try {
        retellWebClient.stopCall();
        console.log('Call ended successfully');
        // onTest will be called via the call_ended event listener
      } catch (error) {
        console.error('Error ending call:', error);
        toast.error(t('error_ending_call') || 'Error ending call');
        onTest(); // Ensure we still notify parent even if error
      } finally {
        setEndingCall(false);
      }
    } else {
      try {
        // Registrar la llamada con la API
        const registerCallResponse = await registerCall(agentId || '');
        
        // Si obtenemos un token de acceso, iniciamos la llamada con el SDK
        if (registerCallResponse.access_token) {
          console.log('Web call created with access token:', registerCallResponse.access_token);
          
          // Iniciar la llamada con el SDK
          retellWebClient
            .startCall({
              accessToken: registerCallResponse.access_token,
            })
            .catch(console.error);
            
          // Notificar al componente padre que la llamada ha comenzado
          onTest();
        }
      } catch (error) {
        console.error('Error creating web call:', error);
        toast.error(t('error_creating_call') || 'Error creating call');
      }
    }
  };
  
  // Función para registrar la llamada
  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch('https://iallamadas.universidadisep.com/create-web-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId
          // Se pueden añadir metadata y retell_llm_dynamic_variables si es necesario
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error('Error registering call:', err);
      throw new Error('Failed to register call');
    }
  }
  
  if (isRecording) {
    return (
      <Button 
        onClick={handleClick}
        variant="outline"
        className="w-40 bg-white text-red-500 border-red-500 hover:bg-red-50"
        disabled={endingCall}
      >
        <Square className="mr-2 h-4 w-4" />
        {endingCall ? t('ending_call') || 'Ending call...' : t('Colgar')}
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleClick}
      variant="default"
      disabled={isLoading}
    >
      {t('test')}
    </Button>
  );
};

export default TestControlButton;
