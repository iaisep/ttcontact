
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Agent } from './hooks/useAgents';
import { PhoneNumber } from './hooks/usePhoneNumbers';
import AgentSelector from './components/AgentSelector';
import PhoneHeader from './components/PhoneHeader';
import WebhookSettings from './components/WebhookSettings';

interface PhoneDetailViewProps {
  phone: PhoneNumber;
  agents: Agent[];
  onAssignAgent: (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => Promise<boolean>;
  onDeletePhone: (phoneId: string) => Promise<boolean>;
  onUpdatePhoneName: (phoneId: string, name: string) => Promise<boolean>;
  onUpdateWebhook: (phoneId: string, webhookUrl: string | null) => Promise<boolean>;
}

const PhoneDetailView: React.FC<PhoneDetailViewProps> = ({ 
  phone, 
  agents,
  onAssignAgent,
  onDeletePhone,
  onUpdatePhoneName,
  onUpdateWebhook
}) => {
  const [inboundAgent, setInboundAgent] = useState<string>(phone.inbound_agent_id || 'none');
  const [outboundAgent, setOutboundAgent] = useState<string>(phone.outbound_agent_id || 'none');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Update state when phone changes
  useEffect(() => {
    setInboundAgent(phone.inbound_agent_id || 'none');
    setOutboundAgent(phone.outbound_agent_id || 'none');
  }, [phone]);

  const handleMakeCall = () => {
    toast.info('Outbound call feature will be implemented soon');
  };

  const handleDeleteConfirm = async () => {
    await onDeletePhone(phone.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Inbound call agent</h3>
          <AgentSelector
            value={inboundAgent}
            agents={agents}
            onChange={(value) => {
              setInboundAgent(value);
              onAssignAgent(phone.id, value, 'inbound');
            }}
          />
        </div>

        <WebhookSettings 
          webhookUrl={phone.inbound_webhook_url || ''}
          onUpdateWebhook={(url) => onUpdateWebhook(phone.id, url)}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outbound call agent</h3>
          <AgentSelector
            value={outboundAgent}
            agents={agents}
            onChange={(value) => {
              setOutboundAgent(value);
              onAssignAgent(phone.id, value, 'outbound');
            }}
          />
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
