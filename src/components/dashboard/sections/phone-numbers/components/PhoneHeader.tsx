
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Copy, Phone, Trash2 } from 'lucide-react';
import { PhoneNumber } from '../hooks/usePhoneNumbers';

interface PhoneHeaderProps {
  phone: PhoneNumber;
  onUpdatePhoneName: (phoneId: string, name: string) => Promise<boolean>;
  onCopyNumber: () => void;
  onMakeCall: () => void;
  onDelete: () => void;
}

const PhoneHeader = ({ 
  phone, 
  onUpdatePhoneName, 
  onCopyNumber, 
  onMakeCall, 
  onDelete 
}: PhoneHeaderProps) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(phone.friendly_name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = async () => {
    const success = await onUpdatePhoneName(phone.id, name);
    if (success) {
      setEditingName(false);
    }
  };

  return (
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
              onClick={onCopyNumber}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </span>
          <span className="mx-2">•</span>
          <span>Provider: Custom telephony</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onMakeCall}>
          <Phone className="mr-2 h-4 w-4" />
          Make an outbound call
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PhoneHeader;
