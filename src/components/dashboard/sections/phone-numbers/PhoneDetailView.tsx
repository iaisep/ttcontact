
import React, { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

interface Agent {
  id: string;
  name: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  friendly_name: string;
  status: 'active' | 'inactive';
  agent_id?: string;
  created_at: string;
  inbound_agent_id?: string;
  outbound_agent_id?: string;
  inbound_webhook_url?: string | null;
}

interface PhoneDetailViewProps {
  phone: PhoneNumber;
  agents: Agent[];
  onAssignAgent: (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => void;
  onDeletePhone: (phoneId: string) => void;
  onUpdatePhoneName: (phoneId: string, name: string) => void;
  onUpdateWebhook: (phoneId: string, webhookUrl: string | null) => void;
}

const PhoneDetailView: React.FC<PhoneDetailViewProps> = ({ 
  phone, 
  agents,
  onAssignAgent,
  onDeletePhone,
  onUpdatePhoneName,
  onUpdateWebhook
}) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(phone.friendly_name);
  const [inboundAgent, setInboundAgent] = useState<string>(phone.inbound_agent_id || '');
  const [outboundAgent, setOutboundAgent] = useState<string>(phone.outbound_agent_id || '');
  const [webhookEnabled, setWebhookEnabled] = useState<boolean>(!!phone.inbound_webhook_url);
  const [webhookUrl, setWebhookUrl] = useState<string>(phone.inbound_webhook_url || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Update state when phone changes
  useEffect(() => {
    setName(phone.friendly_name);
    setInboundAgent(phone.inbound_agent_id || '');
    setOutboundAgent(phone.outbound_agent_id || '');
    setWebhookEnabled(!!phone.inbound_webhook_url);
    setWebhookUrl(phone.inbound_webhook_url || '');
  }, [phone]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phone.number);
    toast.success('Phone number copied to clipboard');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = () => {
    onUpdatePhoneName(phone.id, name);
    setEditingName(false);
  };

  const handleWebhookChange = (checked: boolean) => {
    setWebhookEnabled(checked);
    if (!checked) {
      onUpdateWebhook(phone.id, null);
      setWebhookUrl('');
    }
  };

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value);
  };

  const handleWebhookSave = () => {
    if (webhookUrl) {
      onUpdateWebhook(phone.id, webhookUrl);
    }
  };

  const handleMakeCall = () => {
    toast.info('Outbound call feature will be implemented soon');
  };

  const handleDeleteConfirm = () => {
    onDeletePhone(phone.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="border border-input bg-background rounded-md px-3 py-2 text-xl font-semibold"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveName}>Save</Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setName(phone.friendly_name);
                  setEditingName(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{name}</h2>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8" 
                onClick={() => setEditingName(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              ID: {phone.number} 
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6" 
                onClick={handleCopyNumber}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </span>
            <span className="mx-2">•</span>
            <span>Provider: Custom telephony</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleMakeCall}>
            <Phone className="mr-2 h-4 w-4" />
            Make an outbound call
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Inbound call agent</h3>
          <Select 
            value={inboundAgent} 
            onValueChange={(value) => {
              setInboundAgent(value);
              onAssignAgent(phone.id, value, 'inbound');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Unassigned)</SelectItem>
              {agents.map(agent => (
                <SelectItem key={`inbound-${agent.id}`} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="webhook" 
                checked={webhookEnabled}
                onCheckedChange={handleWebhookChange}
              />
              <Label htmlFor="webhook" className="text-sm">
                Add an inbound webhook (Learn more)
              </Label>
            </div>
            
            {webhookEnabled && (
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  placeholder="https://your-webhook-url.com" 
                  value={webhookUrl}
                  onChange={handleWebhookUrlChange}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleWebhookSave}>Save</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Outbound call agent</h3>
          <Select 
            value={outboundAgent} 
            onValueChange={(value) => {
              setOutboundAgent(value);
              onAssignAgent(phone.id, value, 'outbound');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Unassigned)</SelectItem>
              {agents.map(agent => (
                <SelectItem key={`outbound-${agent.id}`} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
