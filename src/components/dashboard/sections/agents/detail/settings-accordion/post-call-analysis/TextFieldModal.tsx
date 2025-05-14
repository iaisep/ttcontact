
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TextIcon, Hash, Trash, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { FieldModalProps } from './types';

const TextFieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, type, existingItem }) => {
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [formatExamples, setFormatExamples] = useState<string[]>(existingItem?.examples || []);
  const [newExample, setNewExample] = useState('');

  const handleAddExample = () => {
    if (!newExample.trim()) return;
    setFormatExamples([...formatExamples, newExample.trim()]);
    setNewExample('');
  };

  const handleRemoveExample = (index: number) => {
    setFormatExamples(formatExamples.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    // Updated to use "string" or "number" based on the type prop
    const item = {
      type: type === 'text' ? 'string' : 'number',
      name: name.trim(),
      description: description.trim(),
      examples: formatExamples,
    };
    
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            {type === 'text' && <TextIcon className="h-4 w-4" />}
            {type === 'number' && <Hash className="h-4 w-4" />}
            {type === 'text' ? 'Text' : 'Number'}
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
              placeholder="e.g., detailed_call_summary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what information should be extracted"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Format Examples (Optional)</Label>
            <div className="space-y-2">
              {formatExamples.map((example, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={example} readOnly className="flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveExample(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input 
                  value={newExample} 
                  onChange={(e) => setNewExample(e.target.value)} 
                  placeholder="Add a format example"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExample();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddExample}
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TextFieldModal;
