
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useVoiceFiltering } from './useVoiceFiltering';
import VoiceProviderTabs from './VoiceProviderTabs';
import VoiceFilterBar from './VoiceFilterBar';
import VoiceTable from './VoiceTable';
import { Voice } from './types';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
  selectedVoice?: string;
  agent?: RetellAgent;
  updateAgentField?: (fieldName: string, value: any) => void;
}

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  open,
  onClose,
  onSelectVoice,
  selectedVoice,
  agent,
  updateAgentField
}) => {
  const { t } = useLanguage();
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  
  const {
    activeProvider,
    setActiveProvider,
    searchTerm,
    setSearchTerm,
    genderFilter,
    setGenderFilter,
    accentFilter,
    setAccentFilter,
    typeFilter,
    setTypeFilter,
    filteredVoices
  } = useVoiceFiltering();

  // Update local state when agent prop changes
  useEffect(() => {
    if (agent) {
      setAgentName(agent.agent_name || agent.name || '');
      setAgentDescription(agent.description || '');
    }
  }, [agent]);

  const handleSelectVoice = (voice: Voice) => {
    onSelectVoice(voice);
    onClose();
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgentName(value);
    if (updateAgentField) {
      updateAgentField('agent_name', value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAgentDescription(value);
    if (updateAgentField) {
      updateAgentField('description', value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="px-6 pt-6 pb-2 text-xl font-semibold">
          {t('select_voice')}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>
        
        {/* Agent header section (only show if agent is provided) */}
        {agent && updateAgentField && (
          <div className="px-6 pb-4 border-b">
            <div className="flex gap-4 items-start">
              {agent.avatar_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={agent.avatar_url} 
                    alt={agent.agent_name || agent.name} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-grow space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('agent_name')}</label>
                  <Input 
                    value={agentName} 
                    onChange={handleNameChange}
                    placeholder={t('agent_name_placeholder')}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('description')}</label>
                  <Textarea 
                    value={agentDescription} 
                    onChange={handleDescriptionChange}
                    placeholder={t('agent_description_placeholder')}
                    className="w-full"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <VoiceProviderTabs 
          activeProvider={activeProvider}
          setActiveProvider={setActiveProvider}
        >
          <VoiceFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            accentFilter={accentFilter}
            setAccentFilter={setAccentFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
          
          <VoiceTable 
            voices={filteredVoices}
            onSelectVoice={handleSelectVoice}
            selectedVoiceId={selectedVoice}
          />
        </VoiceProviderTabs>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
