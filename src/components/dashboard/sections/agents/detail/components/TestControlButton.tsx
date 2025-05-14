
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

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
      // End the call functionality - now with the specific endpoint
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
        // Call the specified endpoint with the required payload
        const response = await fetch('https://iallamadas.universidadisep.com/create-web-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: agentId || ''
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Web call created:', data);
        
        // After successful API call, trigger the original onTest function
        onTest();
      } catch (error) {
        console.error('Error creating web call:', error);
        toast.error(t('error_creating_call') || 'Error creating call');
      }
    }
  };
  
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
