
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useApiContext } from '@/context/ApiContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PronunciationEntry {
  word: string;
  alphabet: string;
  phoneme: string;
}

interface PronunciationSectionProps {
  agentId?: string;
  pronunciationDictionary?: PronunciationEntry[];
  onUpdate?: (dictionary: PronunciationEntry[]) => void;
}

export const PronunciationSection: React.FC<PronunciationSectionProps> = ({ 
  agentId,
  pronunciationDictionary = [],
  onUpdate
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { fetchWithAuth } = useApiContext();
  
  const form = useForm<PronunciationEntry>({
    defaultValues: {
      word: '',
      alphabet: 'ipa',
      phoneme: ''
    }
  });

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      // Editing existing entry
      const entry = pronunciationDictionary[index];
      form.reset(entry);
      setIsEditing(true);
      setEditIndex(index);
    } else {
      // Adding new entry
      form.reset({
        word: '',
        alphabet: 'ipa',
        phoneme: ''
      });
      setIsEditing(false);
      setEditIndex(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleDelete = async (index: number) => {
    try {
      const newDictionary = [...pronunciationDictionary];
      newDictionary.splice(index, 1);
      
      if (agentId) {
        await fetchWithAuth(`/update-agent/${agentId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            pronunciation_dictionary: newDictionary
          })
        });
        
        toast.success('Pronunciation entry deleted');
      }
      
      if (onUpdate) {
        onUpdate(newDictionary);
      }
    } catch (error) {
      console.error('Error deleting pronunciation:', error);
      toast.error('Failed to delete pronunciation');
    }
  };

  const handleSubmit = async (values: PronunciationEntry) => {
    try {
      let newDictionary;
      
      if (isEditing && editIndex !== null) {
        // Update existing entry
        newDictionary = [...pronunciationDictionary];
        newDictionary[editIndex] = values;
      } else {
        // Add new entry
        newDictionary = [...pronunciationDictionary, values];
      }
      
      // If we have an agent ID, update the agent
      if (agentId) {
        const currentAgentId = agentId;
        
        await fetchWithAuth(`/update-agent/${currentAgentId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            pronunciation_dictionary: newDictionary
          })
        });
        
        toast.success(isEditing ? 'Pronunciation updated successfully' : 'Pronunciation added successfully');
      }
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate(newDictionary);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating pronunciation:', error);
      toast.error('Failed to update pronunciation');
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Pronunciation</Label>
      <p className="text-xs text-gray-500">Guide the model to pronounce a word, name, or phrase in a specific way. (Learn more)</p>
      
      {pronunciationDictionary.length > 0 && (
        <div className="space-y-2 mt-4">
          {pronunciationDictionary.map((entry, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 border rounded-md bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">☩</span>
                <span className="font-medium">{entry.word}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(index)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-start">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleOpenDialog()}>
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Update Pronunciation' : 'Add Pronunciation'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter word or phrase" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="alphabet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pronunciation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alphabet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ipa">IPA</SelectItem>
                        <SelectItem value="arpabet">ARPAbet</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phoneme</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phonetic pronunciation" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Update' : 'Save'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PronunciationSection;
