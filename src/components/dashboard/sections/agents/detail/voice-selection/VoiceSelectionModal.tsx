
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useVoiceFiltering } from './useVoiceFiltering';
import { Voice } from './types';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import AgentHeaderInfo from './components/AgentHeaderInfo';
import VoiceSelectionContent from './components/VoiceSelectionContent';

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
  
  const handleNameChange = (value: string) => {
    setAgentName(value);
    if (updateAgentField) {
      updateAgentField('agent_name', value);
    }
  };

  const handleDescriptionChange = (value: string) => {
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
          <AgentHeaderInfo
            agent={agent}
            agentName={agentName}
            agentDescription={agentDescription}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
          />
        )}
        
        <VoiceSelectionContent
          activeProvider={activeProvider}
          setActiveProvider={setActiveProvider}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          accentFilter={accentFilter}
          setAccentFilter={setAccentFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          filteredVoices={filteredVoices}
          onSelectVoice={handleSelectVoice}
          selectedVoice={selectedVoice}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
