
import { toast } from 'sonner';
import { useVoiceModal } from './VoiceModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';

export const useVoiceCloneHandler = () => {
  const { t } = useLanguage();
  const { fetchWithAuth,apiKey } = useApiContext();
  const { 
    voiceName, 
    audioFile, 
    setIsLoading, 
    termsAccepted
  } = useVoiceModal();
  
  const handleAddClonedVoice = async () => {
    if (!termsAccepted) {
      toast.error(t('please_accept_terms') || 'Please accept the terms to continue');
      return false;
    }
    
    if (!voiceName || !audioFile) {
      toast.error(t('please_provide_name_and_file') || 'Please provide a name and an audio file');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('name', voiceName);
      formData.append('audio_file', audioFile);
      
      // Get authentication token from the API context
      const authToken = localStorage.getItem('auth_token') || '';
      
      console.log('Cloning voice with token:', ,apiKey ? 'Token exists' : 'No token available');
      console.log('Using baseURL:', fetchWithAuth.baseURL);
      
      // Use the fetchWithAuth.baseURL and proper authorization header
      const response = await fetch(`${fetchWithAuth.baseURL}/clone-voice`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${,apiKey}`
        }
      });
      
      console.log('Voice clone response status:', response.status);
      
      if (response.status === 201 || response.ok) {
        toast.success(t('voice_cloning_started') || 'Voice cloning started successfully');
        
        // Inform the user that the voice will be available after processing
        toast.info(
          t('voice_processing_info') || 
          'Your voice is being processed and will be available shortly'
        );
        
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error cloning voice:', error);
      toast.error(t('error_cloning_voice') || 'Error cloning voice');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddClonedVoice };
};
