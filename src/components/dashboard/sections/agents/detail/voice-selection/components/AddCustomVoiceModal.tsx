
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import VoiceCloneTab from './voice-tabs/VoiceCloneTab';
import CommunityVoicesTab from './voice-tabs/CommunityVoicesTab';
import { Checkbox } from '@/components/ui/checkbox';

export interface CommunityVoice {
  id: string;
  name: string;
  description: string;
  provider_voice_id: string;
  public_user_id: string;
}

interface AddCustomVoiceModalProps {
  open: boolean;
  onClose: () => void;
  onVoiceAdded: (voice: any) => void;
}

const AddCustomVoiceModal: React.FC<AddCustomVoiceModalProps> = ({ 
  open, 
  onClose, 
  onVoiceAdded 
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [activeTab, setActiveTab] = useState<string>("voice-clone");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const handleAddCommunityVoice = async (voice: CommunityVoice) => {
    if (!termsAccepted) {
      toast.error(t('please_accept_terms') || 'Please accept the terms to continue');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/add-community-voice', {
        method: 'POST',
        body: JSON.stringify({
          provider_voice_id: voice.provider_voice_id,
          public_user_id: voice.public_user_id,
          voice_name: voice.name
        })
      });
      
      if (response) {
        toast.success(t('voice_added_successfully') || 'Voice added successfully');
        onVoiceAdded(response);
        onClose();
      }
    } catch (error) {
      console.error('Error adding community voice:', error);
      toast.error(t('error_adding_voice') || 'Error adding voice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClonedVoice = async (name: string, audioFile: File) => {
    if (!termsAccepted) {
      toast.error(t('please_accept_terms') || 'Please accept the terms to continue');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('name', name);
      formData.append('audio_file', audioFile);
      
      const response = await fetchWithAuth('/add-cloned-voice', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header when sending FormData
        headers: {}
      });
      
      if (response) {
        toast.success(t('voice_cloned_successfully') || 'Voice cloned successfully');
        onVoiceAdded(response);
        onClose();
      }
    } catch (error) {
      console.error('Error cloning voice:', error);
      toast.error(t('error_cloning_voice') || 'Error cloning voice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg">{t('add_custom_voice') || 'Add Custom Voice'}</DialogTitle>
          {/* Close button hidden as requested */}
        </DialogHeader>
        
        <Tabs 
          defaultValue="voice-clone" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger 
              value="voice-clone" 
              className="text-sm py-1.5 h-9 flex-1 data-[state=active]:font-medium"
            >
              {t('voice_clone') || 'Voice Clone'}
            </TabsTrigger>
            <TabsTrigger 
              value="community-voices" 
              className="text-sm py-1.5 h-9 flex-1 data-[state=active]:font-medium"
            >
              {t('community_voices') || 'Community Voices'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice-clone" className="mt-4">
            <VoiceCloneTab 
              onAddVoice={handleAddClonedVoice} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="community-voices" className="mt-4">
            <CommunityVoicesTab 
              onSelectVoice={handleAddCommunityVoice} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex items-start space-x-2 mb-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted} 
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            className="mt-1"
          />
          <div className="max-w-[360px] overflow-hidden">
            <label htmlFor="terms" className="text-xs leading-tight inline-block cursor-pointer">
              {t('i_hereby_confirm_that_i_have_all_necessary_rights_or_consents_to_upload_and_clone_these_voice_samples_and_that_i_will_not_use_the_platform_generated_content_for_any_illegal_fraudulent_or_harmful_purpose') || 
              'I hereby confirm that I have all necessary rights or consents to upload and clone these voice samples and that I will not use the platform-generated content for any illegal, fraudulent, or harmful purpose.'}
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="h-8 px-3 text-sm">
            {t('cancel') || 'Cancel'}
          </Button>
          {isLoading && (
            <Button disabled className="h-8 px-3 text-sm">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              {t('saving') || 'Saving...'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomVoiceModal;
