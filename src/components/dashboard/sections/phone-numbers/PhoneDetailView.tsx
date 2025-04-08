
import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Pencil, Copy, Phone } from 'lucide-react';
import { toast } from 'sonner';

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
}

interface PhoneDetailViewProps {
  phone: PhoneNumber;
  agents: Agent[];
  onAssignAgent: (phoneId: string, agentId: string, direction: 'inbound' | 'outbound') => void;
}

const PhoneDetailView: React.FC<PhoneDetailViewProps> = ({ 
  phone, 
  agents,
  onAssignAgent 
}) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(phone.friendly_name);
  const [inboundAgent, setInboundAgent] = useState<string>(phone.agent_id || '');
  const [outboundAgent, setOutboundAgent] = useState<string>(phone.agent_id || '');

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phone.number);
    toast.success('Phone number copied to clipboard');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = () => {
    // Here you would save the name to the backend
    setEditingName(false);
    toast.success('Phone name updated');
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

        <Button>
          <Phone className="mr-2 h-4 w-4" />
          Make an outbound call
        </Button>
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
              <SelectItem value="">None (Unassigned)</SelectItem>
              {agents.map(agent => (
                <SelectItem key={`inbound-${agent.id}`} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox id="webhook" />
          <Label htmlFor="webhook" className="text-sm">
            Add an inbound webhook (Learn more)
          </Label>
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
              <SelectItem value="">None (Unassigned)</SelectItem>
              {agents.map(agent => (
                <SelectItem key={`outbound-${agent.id}`} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetailView;
