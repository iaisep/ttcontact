
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
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

  const handleSelectTemplate = async (templateType: string) => {
    if (templateType === 'blank') {
      // Create a single prompt agent and navigate to its detail page
      const agentResponse = await createSinglePromptAgent();
      
      if (agentResponse?.agent_id) {
        onClose();
        navigate(`/agentes/${agentResponse.agent_id}`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
          <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-6 py-4">
          <div className="flex flex-col">
            <div className="border-r pr-4">
              <ul className="space-y-3">
                <li className="text-primary font-medium">Single Prompt</li>
                <li className="text-muted-foreground">Multi Prompt</li>
                <li className="text-muted-foreground">Conversation Flow</li>
              </ul>
            </div>
          </div>
          
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <div 
              className="p-4 border rounded-md flex flex-col items-center justify-center hover:border-primary cursor-pointer"
              onClick={() => handleSelectTemplate('blank')}
            >
              <div className="w-16 h-16 flex items-center justify-center text-3xl text-muted-foreground">+</div>
              <div className="mt-4 text-center">
                <p className="font-medium">Start from blank</p>
              </div>
              {isCreating && (
                <div className="mt-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              )}
            </div>
            
            <div className="p-4 border rounded-md hover:border-primary cursor-pointer opacity-50">
              <div className="flex justify-center mb-2">
                <Phone className="text-primary" />
              </div>
              <p className="font-medium text-center">Healthcare Check-In</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Transfer call</p>
              <p className="text-xs text-center mt-4">
                Ask questions to gather information, can transfer call.
              </p>
            </div>
            
            <div className="p-4 border rounded-md hover:border-primary cursor-pointer opacity-50">
              <div className="flex justify-center mb-2">
                <Phone className="text-primary" />
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
