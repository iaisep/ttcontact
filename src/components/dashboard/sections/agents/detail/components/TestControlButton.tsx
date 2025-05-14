
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

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

const TestControlButton: React.FC<TestControlButtonProps> = ({
  isRecording,
  isLoading,
  onTest,
  agentId
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [endingCall, setEndingCall] = useState(false);
  
  const handleClick = async () => {
    if (isRecording) {
      // End the call functionality
      setEndingCall(true);
      try {
        // Call the specified endpoint to end the call
        const response = await fetch('https://api.retellai.com/end-call/call_b66795a356cb2effb219b9598ad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ending call: ${response.status}`);
        }
        
        console.log('Call ended successfully');
        // After ending the call successfully, trigger the original onTest function
        onTest();
      } catch (error) {
        console.error('Error ending call:', error);
        toast.error(t('error_ending_call') || 'Error ending call');
      } finally {
        setEndingCall(false);
      }
    } else {
      try {
        // Registrar la llamada con la API usando el mismo endpoint que en el código proporcionado
        const registerCallResponse = await registerCall(agentId || '');
        
        // Si obtenemos un token de acceso, la llamada se ha registrado correctamente
        if (registerCallResponse.access_token) {
          console.log('Web call created with access token:', registerCallResponse.access_token);
          
          // Después de registrar la llamada con éxito, activamos la función onTest original
          onTest();
        }
      } catch (error) {
        console.error('Error creating web call:', error);
        toast.error(t('error_creating_call') || 'Error creating call');
      }
    }
  };
  
  // Función para registrar la llamada, siguiendo el mismo patrón del código proporcionado
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
        {endingCall ? t('ending_call') || 'Ending call...' : t('end_the_call')}
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
