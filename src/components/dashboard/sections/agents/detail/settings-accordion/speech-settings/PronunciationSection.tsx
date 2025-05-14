
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
  const { fetchWithAuth } = useApiContext();
  
  const form = useForm<PronunciationEntry>({
    defaultValues: {
      word: '',
      alphabet: 'ipa',
      phoneme: ''
    }
  });

  const handleOpenDialog = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (values: PronunciationEntry) => {
    try {
      // Create a new dictionary by adding the new entry to the existing dictionary
      const newDictionary = [...pronunciationDictionary, values];
      
      // If we have an agent ID, update the agent
      if (agentId) {
        // Create the payload object with the updated dictionary
        const payload = {
          pronunciation_dictionary: newDictionary
        };
        
        console.log('Updating pronunciation dictionary with payload:', payload);
        
        // Send the request with the properly structured payload
        await fetchWithAuth(`/update-agent/${agentId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        
        toast.success('Pronunciation added successfully');
      }
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate(newDictionary);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating pronunciation:', error);
      toast.error('Failed to add pronunciation');
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-amber-600">Pronunciation</Label>
      <p className="text-xs text-gray-500">Guide the model to pronounce a word, name, or phrase in a specific way. (Learn more)</p>
      <div className="flex justify-start">
        <Button variant="outline" size="sm" className="text-xs" onClick={handleOpenDialog}>
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Pronunciation</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word or Phrase</FormLabel>
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
                    <FormLabel>Alphabet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alphabet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ipa">IPA (International Phonetic Alphabet)</SelectItem>
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
                    <FormLabel>Phonetic Pronunciation</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phonetic pronunciation" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PronunciationSection;
