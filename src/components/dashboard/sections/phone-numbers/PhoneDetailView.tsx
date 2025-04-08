
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Copy, Phone, Trash2, PhoneOutgoing } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Agent } from '../agents/types';
import { PhoneNumber } from './hooks/types';
import AgentSelector from './components/AgentSelector';
import WebhookSettings from './components/WebhookSettings';
import OutboundCallDialog from './dialogs/OutboundCallDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PhoneDetailViewProps {
  phone: PhoneNumber;
  agents: Agent[];
  loading: {
    agents: boolean;
    phones: boolean;
  };
  onAssignAgent: (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => Promise<boolean>;
  onDeletePhone: (phoneId: string) => Promise<boolean>;
  onUpdatePhoneName: (phoneId: string, name: string) => Promise<boolean>;
  onUpdateWebhook: (phoneId: string, webhookUrl: string | null) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

const PhoneDetailView: React.FC<PhoneDetailViewProps> = ({ 
  phone, 
  agents = [], 
  loading = { agents: false, phones: false }, 
  onAssignAgent,
  onDeletePhone,
  onUpdatePhoneName,
  onUpdateWebhook,
  onRefresh
}) => {
  const [inboundAgent, setInboundAgent] = useState<string>(phone.inbound_agent_id || 'none');
  const [outboundAgent, setOutboundAgent] = useState<string>(phone.outbound_agent_id || 'none');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdatingInbound, setIsUpdatingInbound] = useState(false);
  const [isUpdatingOutbound, setIsUpdatingOutbound] = useState(false);
  const [outboundCallDialogOpen, setOutboundCallDialogOpen] = useState(false);

  // Update state when phone changes
  useEffect(() => {
    console.log('PhoneDetailView: Updating agent state from phone:', phone.number);
    console.log('PhoneDetailView: inbound_agent_id:', phone.inbound_agent_id);
    console.log('PhoneDetailView: outbound_agent_id:', phone.outbound_agent_id);
    
    setInboundAgent(phone.inbound_agent_id || 'none');
    setOutboundAgent(phone.outbound_agent_id || 'none');
  }, [phone]);

  // Debugging logging
  useEffect(() => {
    console.log('PhoneDetailView: Phone data updated', phone);
    console.log('PhoneDetailView: Inbound agent ID:', inboundAgent);
    console.log('PhoneDetailView: Outbound agent ID:', outboundAgent);
  }, [phone, inboundAgent, outboundAgent]);

  useEffect(() => {
    console.log('PhoneDetailView: Agents data received:', agents.length, 'agents');
  }, [agents]);

  const handleMakeCall = () => {
    setOutboundCallDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await onDeletePhone(phone.id);
    setDeleteDialogOpen(false);
  };

  const handleInboundAgentChange = async (value: string) => {
    setIsUpdatingInbound(true);
    try {
      console.log('Assigning inbound agent:', value, 'to phone:', phone.id);
      const success = await onAssignAgent(phone.id, value, 'inbound');
      if (success) {
        setInboundAgent(value);
        toast.success('Inbound agent assigned successfully');
      } else {
        toast.error('Failed to assign inbound agent');
        // Revert to previous value if update failed
        setInboundAgent(phone.inbound_agent_id || 'none');
      }
    } catch (error) {
      console.error('Error assigning inbound agent:', error);
      toast.error('Error assigning inbound agent');
      // Revert to previous value
      setInboundAgent(phone.inbound_agent_id || 'none');
    } finally {
      setIsUpdatingInbound(false);
    }
  };

  const handleOutboundAgentChange = async (value: string) => {
    setIsUpdatingOutbound(true);
    try {
      const success = await onAssignAgent(phone.id, value, 'outbound');
      if (success) {
        setOutboundAgent(value);
        toast.success('Outbound agent assigned successfully');
      } else {
        toast.error('Failed to assign outbound agent');
        // Revert to previous value if update failed
        setOutboundAgent(phone.outbound_agent_id || 'none');
      }
    } catch (error) {
      console.error('Error assigning outbound agent:', error);
      toast.error('Error assigning outbound agent');
      // Revert to previous value
      setOutboundAgent(phone.outbound_agent_id || 'none');
    } finally {
      setIsUpdatingOutbound(false);
    }
  };

  const handleUpdateWebhook = async (webhookUrl: string | null) => {
    return await onUpdateWebhook(phone.id, webhookUrl);
  };

  // Get the display name, prioritizing friendly_name, then nickname, then default to 'Unnamed Phone'
  const displayName = phone.friendly_name || phone.nickname || 'Unnamed Phone';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">
              {displayName}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newName = prompt('Enter new name', displayName);
                if (newName && newName !== displayName) {
                  onUpdatePhoneName(phone.id, newName);
                }
              }} 
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>ID: {phone.number}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(phone.number);
                      toast.success('Phone number copied to clipboard');
                    }} 
                    className="h-6 w-6 p-0 ml-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Copy number
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="ml-3">Provider: {phone.provider || 'Custom telephony'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleMakeCall}
            className="flex items-center gap-2"
          >
            <PhoneOutgoing className="h-4 w-4" />
            Make an outbound call
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDeleteDialogOpen(true)} 
                  className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Release phone number
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Agent Settings and Webhook Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Inbound call agent</h3>
          <AgentSelector
            value={inboundAgent}
            agents={agents}
            onChange={handleInboundAgentChange}
            isLoading={isUpdatingInbound || loading.agents}
          />
          {isUpdatingInbound && (
            <p className="text-xs text-muted-foreground">Updating inbound agent...</p>
          )}
        </div>

        <WebhookSettings 
          webhookUrl={phone.inbound_webhook_url || ''}
          onUpdateWebhook={handleUpdateWebhook}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outbound call agent</h3>
          <AgentSelector
            value={outboundAgent}
            agents={agents}
            onChange={handleOutboundAgentChange}
            isLoading={isUpdatingOutbound || loading.agents}
          />
          {isUpdatingOutbound && (
            <p className="text-xs text-muted-foreground">Updating outbound agent...</p>
          )}
        </div>
      </div>

      {/* Outbound Call Dialog */}
      <OutboundCallDialog
        open={outboundCallDialogOpen}
        onOpenChange={setOutboundCallDialogOpen}
        fromNumber={phone.number}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release phone number</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to release this phone number? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PhoneDetailView;
