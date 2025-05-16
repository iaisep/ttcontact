
import { toast } from 'sonner';
import { useVoiceModal } from './VoiceModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';

export const useCommunityVoiceHandler = (onVoiceAdded: (voice: any) => void) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const { 
    selectedVoice, 
    setIsLoading, 
    termsAccepted 
  } = useVoiceModal();
  
  const handleAddCommunityVoice = async () => {
    if (!termsAccepted) {
      toast.error(t('please_accept_terms') || 'Please accept the terms to continue');
      return false;
    }
    
    if (!selectedVoice) {
      toast.error(t('please_select_voice') || 'Please select a voice first');
      return false;
    }
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/add-community-voice', {
        method: 'POST',
        body: JSON.stringify({
          provider_voice_id: selectedVoice.provider_voice_id,
          public_user_id: selectedVoice.public_user_id,
          voice_name: selectedVoice.name
        })
      });
      
      if (response) {
        toast.success(t('voice_added_successfully') || 'Voice added successfully');
        onVoiceAdded(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding community voice:', error);
      toast.error(t('error_adding_voice') || 'Error adding voice');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAddCommunityVoice };
};
