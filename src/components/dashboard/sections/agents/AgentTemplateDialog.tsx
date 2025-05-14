
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, X, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgentCreation } from './hooks/useAgentCreation';
import { useNavigate } from 'react-router-dom';

interface AgentTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateType: string) => void;
}

const AgentTemplateDialog: React.FC<AgentTemplateDialogProps> = ({ 
  open, 
  onClose
}) => {
  const { t } = useLanguage();
  const { createSinglePromptAgent, isCreating } = useAgentCreation();
  const navigate = useNavigate();
  const [activePromptType, setActivePromptType] = useState<string>('single');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectPromptType = (type: string) => {
    setActivePromptType(type);
    // Reset selected template when changing prompt type
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = async (templateType: string) => {
    // Only set selected template if we're not already creating
    if (!isCreating) {
      setSelectedTemplate(templateType);
      
      if (templateType === 'blank') {
        try {
          // Create a single prompt agent and navigate to its detail page
          const agentResponse = await createSinglePromptAgent();
          
          if (agentResponse?.agent_id) {
            onClose();
            navigate(`/agentes/${agentResponse.agent_id}`);
          }
        } catch (error) {
          console.error("Error creating agent:", error);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a prompt type and template to create your agent
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-6 py-4">
          <div className="flex flex-col">
            <div className="border-r pr-4">
              <ul className="space-y-3">
                <li 
                  className={`py-1 px-2 rounded-md cursor-pointer ${activePromptType === 'single' ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                  onClick={() => handleSelectPromptType('single')}
                >
                  Single Prompt
                </li>
                <li 
                  className={`py-1 px-2 rounded-md cursor-not-allowed opacity-60 ${activePromptType === 'multi' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Multi Prompt
                </li>
                <li 
                  className={`py-1 px-2 rounded-md cursor-not-allowed opacity-60 ${activePromptType === 'flow' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  Conversation Flow
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <div 
              className={`p-4 border rounded-md flex flex-col items-center justify-center hover:border-primary cursor-pointer ${selectedTemplate === 'blank' ? 'border-primary bg-primary/5' : ''} ${isCreating ? 'cursor-wait opacity-75' : ''}`}
              onClick={() => !isCreating && handleSelectTemplate('blank')}
            >
              <div className="w-16 h-16 flex items-center justify-center text-3xl text-muted-foreground">
                {isCreating && selectedTemplate === 'blank' ? (
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                ) : (
                  <Plus className="h-8 w-8" />
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium">Start from blank</p>
              </div>
              {isCreating && selectedTemplate === 'blank' && (
                <p className="text-xs text-muted-foreground mt-2">Creating agent...</p>
              )}
            </div>
            
            <div className="p-4 border rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
              <div className="flex justify-center mb-2">
                <Phone className="text-muted-foreground" />
              </div>
              <p className="font-medium text-center">Healthcare Check-In</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Transfer call</p>
              <p className="text-xs text-center mt-4">
                Ask questions to gather information, can transfer call.
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:bg-gray-50 cursor-not-allowed opacity-50">
              <div className="flex justify-center mb-2">
                <Phone className="text-muted-foreground" />
              </div>
              <p className="font-medium text-center">Notification</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Then end the call</p>
              <p className="text-xs text-center mt-4">
                After giving the notification, end the call.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentTemplateDialog;
