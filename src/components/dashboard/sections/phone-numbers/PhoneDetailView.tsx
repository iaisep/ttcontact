
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Copy, Phone, Trash2 } from 'lucide-react';
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
import PhoneHeader from './components/PhoneHeader';
import WebhookSettings from './components/WebhookSettings';

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
    toast.info('Outbound call feature will be implemented soon');
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

  return (
    <div className="space-y-6">
      <div>
        <PhoneHeader 
          phone={phone} 
          onUpdatePhoneName={onUpdatePhoneName}
          onCopyNumber={() => {
            navigator.clipboard.writeText(phone.number);
            toast.success('Phone number copied to clipboard');
          }}
          onMakeCall={handleMakeCall}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </div>

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
