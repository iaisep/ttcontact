
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { KnowledgeBase } from '../../types';

interface KnowledgeBaseFormContentProps {
  name: string;
  setName: (name: string) => void;
  currentKb: KnowledgeBase | null;
  handleAutoSyncChange: (checked: boolean) => void;
}

const KnowledgeBaseFormContent: React.FC<KnowledgeBaseFormContentProps> = ({
  name,
  setName,
  currentKb,
  handleAutoSyncChange,
}) => {
  const form = useForm({
    defaultValues: {
      name: name || '',
      autoSync: currentKb?.auto_sync || false,
    }
  });

  React.useEffect(() => {
    form.setValue('name', name || '');
    if (currentKb) {
      form.setValue('autoSync', currentKb.auto_sync || false);
    }
  }, [name, currentKb, form]);

  return (
    <Form {...form}>
      <form id="knowledge-base-form" className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knowledge Base Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter a name" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autoSync"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Auto-Sync Sources</FormLabel>
                <FormMessage />
                <p className="text-sm text-muted-foreground">
                  Automatically update content from URL sources
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleAutoSyncChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Footer will be rendered by the parent component */}
      </form>
    </Form>
  );
};

export default KnowledgeBaseFormContent;
