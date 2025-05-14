
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Radio, Trash, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { FieldModalProps } from './types';

const SelectorFieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, existingItem }) => {
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [choices, setChoices] = useState<string[]>(existingItem?.choices || existingItem?.examples || []);
  const [newChoice, setNewChoice] = useState('');

  const handleAddChoice = () => {
    if (!newChoice.trim()) return;
    setChoices([...choices, newChoice.trim()]);
    setNewChoice('');
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || choices.length === 0) return;
    
    // Ensure we're using "enum" for the type and "choices" for the options
    const item = {
      type: 'enum',
      name: name.trim(),
      description: description.trim(),
      choices: choices,  // This is the correct field name for enum types
    };
    
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Selector
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., customer_type"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what information should be selected"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choices</Label>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={choice} readOnly className="flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveChoice(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input 
                  value={newChoice} 
                  onChange={(e) => setNewChoice(e.target.value)} 
                  placeholder="Add a new choice"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChoice();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddChoice}
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={!name.trim() || choices.length === 0}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectorFieldModal;
