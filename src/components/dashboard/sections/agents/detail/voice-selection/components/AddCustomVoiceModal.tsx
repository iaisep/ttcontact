
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/context/LanguageContext';
import VoiceCloneTab from './voice-tabs/VoiceCloneTab';
import CommunityVoicesTab from './voice-tabs/CommunityVoicesTab';
import { VoiceModalProvider, useVoiceModal } from './voice-modal/VoiceModalContext';
import ModalFooter from './voice-modal/ModalFooter';
import TermsCheckbox from './voice-modal/TermsCheckbox';
import { useVoiceCloneHandler } from './voice-modal/VoiceCloneHandler';
import { useCommunityVoiceHandler } from './voice-modal/CommunityVoiceHandler';

interface AddCustomVoiceModalProps {
  open: boolean;
  onClose: () => void;
  onVoiceAdded: (voice: any) => void;
}

// Internal component that uses the context
const AddCustomVoiceModalContent: React.FC<AddCustomVoiceModalProps> = ({ 
  open, 
  onClose, 
  onVoiceAdded 
}) => {
  const { t } = useLanguage();
  const { 
    isLoading, 
    activeTab, 
    setActiveTab
  } = useVoiceModal();
  
  const { handleAddClonedVoice } = useVoiceCloneHandler();
  const { handleAddCommunityVoice } = useCommunityVoiceHandler(onVoiceAdded);

  // Handle save button click
  const handleSave = async () => {
    let success = false;
    
    if (activeTab === "community-voices") {
      success = await handleAddCommunityVoice();
    } else {
      success = await handleAddClonedVoice();
    }
    
    if (success) {
      onClose();
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
            <VoiceCloneTab isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="community-voices" className="mt-4">
            <CommunityVoicesTab isLoading={isLoading} />
          </TabsContent>
        </Tabs>
        
        <TermsCheckbox />
        
        <ModalFooter onClose={onClose} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};

// Main exported component that provides the context
const AddCustomVoiceModal: React.FC<AddCustomVoiceModalProps> = (props) => {
  return (
    <VoiceModalProvider>
      <AddCustomVoiceModalContent {...props} />
    </VoiceModalProvider>
  );
};

export default AddCustomVoiceModal;
