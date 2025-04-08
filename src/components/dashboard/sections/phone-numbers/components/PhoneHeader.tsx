
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneNumber } from '../hooks/usePhoneNumbers';
import { Pencil, Copy, Phone, Trash2 } from 'lucide-react';

interface PhoneHeaderProps {
  phone: PhoneNumber;
  onUpdatePhoneName: (phoneId: string, name: string) => Promise<boolean>;
  onCopyNumber: () => void;
  onMakeCall: () => void;
  onDelete: () => void;
}

const PhoneHeader: React.FC<PhoneHeaderProps> = ({ 
  phone, 
  onUpdatePhoneName,
  onCopyNumber,
  onMakeCall,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(phone.friendly_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!nameValue.trim()) return;
    setIsUpdating(true);
    
    try {
      const success = await onUpdatePhoneName(phone.id, nameValue);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setNameValue(phone.friendly_name || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  console.log('PhoneHeader rendering with phone:', phone);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isUpdating}
              className="flex-1"
              aria-label="Phone name"
            />
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
              >
                Save
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold flex-1">
              {phone.friendly_name || 'Unnamed Phone'}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEdit} 
              className="ml-2"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground space-x-1">
        <span>{phone.number}</span>
        <div className="flex space-x-1 ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopyNumber} 
            className="h-6 w-6 p-0"
            title="Copy phone number"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMakeCall} 
            className="h-6 w-6 p-0"
            title="Make a test call"
          >
            <Phone className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete} 
            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Release phone number"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhoneHeader;
